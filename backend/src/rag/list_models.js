import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.GOOGLE_API_KEY;

async function listModels() {
    console.log("=== STEP 1: Verifying Google API Key ===");
    if (!apiKey) {
        console.error("❌ GOOGLE_API_KEY is not defined in your backend/.env file!");
        return;
    }
    console.log(`API Key found (starts with: ${apiKey.substring(0, 7)}...)`);

    console.log("\n=== STEP 2: Listing Models via REST API ===");
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await axios.get(url);
        const models = response.data.models || [];
        
        console.log(`Found ${models.length} available models. Here are some key models:`);
        const targetModels = [
            'gemini-2.5-flash',
            'gemini-1.5-flash',
            'gemini-embedding-001'
        ];
        
        models.forEach(model => {
            const isTarget = targetModels.some(tm => model.name.includes(tm));
            if (isTarget) {
                console.log(`- Name: ${model.name}`);
                console.log(`  DisplayName: ${model.displayName}`);
                console.log(`  Supported Actions: ${model.supportedGenerationMethods.join(', ')}`);
                console.log(`  Input Token Limit: ${model.inputTokenLimit}`);
                console.log(`  Output Token Limit: ${model.outputTokenLimit}\n`);
            }
        });
    } catch (err) {
        console.error("❌ REST API call failed:");
        console.error(err.response ? err.response.data : err.message);
    }

    console.log("=== STEP 3: Testing Model Invocation via LangChain ===");
    try {
        const chatModel = new ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: 'gemini-2.5-flash',
            temperature: 0.7,
        });

        console.log("Sending test prompt: 'Tell me a 1-sentence joke about coding'...");
        const response = await chatModel.invoke("Tell me a 1-sentence joke about coding");
        console.log("Response:");
        console.log(`👉 "${response.content.toString().trim()}"`);
        console.log("✅ LangChain integration works successfully!");
    } catch (err) {
        console.error("❌ LangChain model invocation failed:");
        console.error(err);
    }
}

listModels().catch(console.error);
