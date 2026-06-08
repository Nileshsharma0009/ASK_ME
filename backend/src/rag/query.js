import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone'; // Added this import
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

class GoogleGenerativeAIEmbeddings768 extends GoogleGenerativeAIEmbeddings {
    _convertToContent(text) {
        const req = super._convertToContent(text);
        req.outputDimensionality = 768;
        return req;
    }
}

// Configuration
const embeddings = new GoogleGenerativeAIEmbeddings768({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-embedding-001',
});

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: 'gemini-2.5-flash',  
    temperature: 0.3, 
});

// Configure Pinecone
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function chatting(question, history = []) {
    try {
        let searchExpression = question;
        if (history && history.length > 0) {
            const reformulatePrompt = `Given the following conversation history and a follow-up question, rewrite the follow-up question to be a standalone, detailed search query that can be used to query a vector database for relevant medical/facility info.
Do not answer the question, just return the rewritten search query. If the question is already a standalone search query, return it exactly as is.

Conversation History:
${history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}

Follow-up Question: ${question}

Standalone Search Query:`;

            try {
                const response = await model.invoke(reformulatePrompt);
                const rewritten = response.content.toString().trim();
                if (rewritten && rewritten.length > 0) {
                    searchExpression = rewritten;
                    console.log(`[RAG Memory] Reformulated query: "${searchExpression}" (Original: "${question}")`);
                }
            } catch (err) {
                console.error("Failed to rewrite query, falling back to original:", err);
            }
        }

        // Initialize the PineconeStore instance so LangChain manages retrieval format seamlessly
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
        });

        // Use similarity search to fetch top 10 relevant documents
        const searchResults = await vectorStore.similaritySearch(searchExpression, 10);

        // Map the document content accurately using LangChain's standard property
        const context = searchResults
            .map(doc => doc.pageContent)
            .join("\n\n---\n\n");

        const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant answering questions based on the provided documentation.

Conversation history:
{history}

Context from the documentation:
{context}

Question: {question}

Instructions:
- Answer the question using the context above. Take the conversation history into account if it is a follow-up.
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear.

Answer:
        `);

        const chain = RunnableSequence.from([
            promptTemplate,
            model,
            new StringOutputParser(),
        ]);

        const formattedHistory = history && history.length > 0
            ? history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
            : "No previous conversation history.";

        // Invoke the chain and get the answer
        const answer = await chain.invoke({
            context: context,
            history: formattedHistory,
            question: question,
        }); 

        // CRITICAL FIX: Return the answer back to your Express route controller!
        return answer;

    } catch (error) {
        console.error("Error inside chatting pipeline:", error);
        throw error; // Let the controller catch block handle the fallback safely
    }
}

export { chatting };