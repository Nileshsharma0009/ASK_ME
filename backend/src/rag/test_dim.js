import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Define custom class to set outputDimensionality to 768
class GoogleGenerativeAIEmbeddings768 extends GoogleGenerativeAIEmbeddings {
    _convertToContent(text) {
        const req = super._convertToContent(text);
        req.outputDimensionality = 768;
        return req;
    }
}

async function testDimensions() {
    console.log("=== Testing Vector Embeddings & Dimension ===");

    const text = "What is the location of the Radiology Department?";
    console.log(`Input Text: "${text}"`);

    try {
        console.log("\n1. Initializing standard GoogleGenerativeAIEmbeddings...");
        const standardEmbeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-embedding-001',
        });
        
        console.log("Generating embedding...");
        const standardVector = await standardEmbeddings.embedQuery(text);
        console.log(`Standard Vector Length: ${standardVector.length}`);
        console.log(`First 5 dimensions: [${standardVector.slice(0, 5).join(', ')}]`);
        
    } catch (err) {
        console.error("❌ Standard Embeddings generation failed:", err.message);
    }

    try {
        console.log("\n2. Initializing GoogleGenerativeAIEmbeddings768 (custom class)...");
        const customEmbeddings = new GoogleGenerativeAIEmbeddings768({
            apiKey: process.env.GOOGLE_API_KEY,
            model: 'gemini-embedding-001',
        });
        
        console.log("Generating embedding...");
        const customVector = await customEmbeddings.embedQuery(text);
        console.log(`Custom 768 Vector Length: ${customVector.length}`);
        console.log(`First 5 dimensions: [${customVector.slice(0, 5).join(', ')}]`);
        
        if (customVector.length === 768) {
            console.log("\n✅ Success! The dimension matches the Pinecone index requirement (768 dimensions).");
        } else {
            console.warn(`\n⚠️ Warning! Expected 768 dimensions but got ${customVector.length}.`);
        }
    } catch (err) {
        console.error("❌ Custom Embeddings generation failed:", err.message);
    }
}

testDimensions().catch(console.error);
