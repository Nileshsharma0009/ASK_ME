import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { chatting } from './query.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

class GoogleGenerativeAIEmbeddings768 extends GoogleGenerativeAIEmbeddings {
    _convertToContent(text) {
        const req = super._convertToContent(text);
        req.outputDimensionality = 768;
        return req;
    }
}

async function testQuery() {
    console.log("=== Testing RAG Query Pipeline ===");
    
    // Choose a question related to your RagDoc context or a medical question
    // const question = "Where is the Radiology Department and how do I contact them?";
    // const question = "List the responsibilities of the Steward’s Assistant versus the Chief Cook.";
    // const question = "List the responsibilities of the Steward’s Assistant versus the Chief Cook.";
    const question = "hat is the specific function of a wildcat in the anchoring system?";
    console.log(`Question: "${question}"`);

    // Let's first manually fetch from Pinecone to see what chunks are retrieved
    console.log("\n=== STEP 1: Similarity Search in Pinecone ===");
    try {
        const embeddings = new GoogleGenerativeAIEmbeddings768({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-embedding-001',
        });
        const pinecone = new Pinecone();
        const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
        
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
        
        console.log("Searching for top 3 matching chunks...");
        const searchResults = await vectorStore.similaritySearch(question, 3);
        
        console.log(`Found ${searchResults.length} matching chunks:`);
        searchResults.forEach((doc, idx) => {
            console.log(`\n--- Chunk ${idx + 1} (Score/Metadata info) ---`);
            console.log(`Metadata: ${JSON.stringify(doc.metadata)}`);
            console.log(`Content snippet: "${doc.pageContent.substring(0, 300)}..."`);
        });
    } catch (err) {
        console.error("❌ Similarity search failed:", err.message);
    }

    // Now, run the actual chatting function to see the final response
    console.log("\n=== STEP 2: Running full RAG Chatting Function ===");
    try {
        console.log("Invoking chatting()...");
        const answer = await chatting(question);
        console.log("\nResponse from chatting function:");
        console.log(`👉 "${answer}"`);
        console.log("\n✅ RAG Query Pipeline test finished successfully!");
    } catch (err) {
        console.error("❌ Chatting function failed:", err);
    }
}

testQuery().catch(console.error);
