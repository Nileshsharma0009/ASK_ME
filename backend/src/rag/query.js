import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone'; // Added this import
import * as dotenv from 'dotenv';
dotenv.config();
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

// Configuration
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'text-embedding-004',
});

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',  
    temperature: 0.3, 
});

// Configure Pinecone
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function chatting(question) {
    try {
        // Initialize the PineconeStore instance so LangChain manages retrieval format seamlessly
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
        });

        // Use similarity search to fetch top 10 relevant documents
        const searchResults = await vectorStore.similaritySearch(question, 10);

        // Map the document content accurately using LangChain's standard property
        const context = searchResults
            .map(doc => doc.pageContent)
            .join("\n\n---\n\n");

        const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant answering questions based on the provided documentation.

Context from the documentation:
{context}

Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear
- Use code examples from the context if relevant

Answer:
        `);

        const chain = RunnableSequence.from([
            promptTemplate,
            model,
            new StringOutputParser(),
        ]);

        // Invoke the chain and get the answer
        const answer = await chain.invoke({
            context: context,
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