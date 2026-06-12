import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testLangChainErrors() {
    console.log("=== Testing LangChain & API Error Handling (Educational) ===");

    // Scenario 1: Test with an invalid/missing Google API key
    console.log("\n--- Scenario 1: Testing Google Gemini with Invalid API Key ---");
    try {
        const badModel = new ChatGoogleGenerativeAI({
            apiKey: "INVALID_API_KEY_FOR_TESTING",
            model: "gemini-2.5-flash",
        });
        console.log("Attempting to invoke model with invalid key...");
        await badModel.invoke("Hello");
    } catch (err) {
        console.log("✅ Successfully caught expected Google API error:");
        console.log(`Message: "${err.message}"`);
        console.log("Tip: Check if GOOGLE_API_KEY in backend/.env is correct and not blocked.");
    }

    // Scenario 2: Test with a missing/invalid Pinecone API key
    console.log("\n--- Scenario 2: Testing Pinecone with Invalid API Key ---");
    try {
        console.log("Attempting to initialize Pinecone with invalid key...");
        const badPc = new Pinecone({
            apiKey: "INVALID_PINECONE_KEY_FOR_TESTING"
        });
        await badPc.listIndexes();
    } catch (err) {
        console.log("✅ Successfully caught expected Pinecone API error:");
        console.log(`Message: "${err.message}"`);
        console.log("Tip: Check PINECONE_API_KEY in backend/.env.");
    }

    // Scenario 3: Test querying a non-existent Pinecone index
    console.log("\n--- Scenario 3: Querying Non-existent Pinecone Index ---");
    try {
        const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        console.log("Attempting to target index 'non-existent-index'...");
        const badIndex = pc.Index("non-existent-index");
        await badIndex.describeIndexStats();
    } catch (err) {
        console.log("✅ Successfully caught expected Pinecone Index error:");
        console.log(`Message: "${err.message}"`);
        console.log("Tip: Check PINECONE_INDEX_NAME in backend/.env matches an active index.");
    }

    console.log("\n=== Error Debugging Tips ===");
    console.log("1. HTTP 401: Unauthorized. The API key is invalid or has expired.");
    console.log("2. HTTP 403: Forbidden. The key does not have permission for the requested resource.");
    console.log("3. HTTP 404: Not Found. The resource (e.g. Pinecone Index) does not exist.");
    console.log("4. HTTP 429: Too Many Requests. Rate limit exceeded. Implement retry logic with backoff.");
}

testLangChainErrors().catch(console.error);
