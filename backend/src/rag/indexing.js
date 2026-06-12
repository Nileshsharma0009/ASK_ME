import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

class GoogleGenerativeAIEmbeddings768 extends GoogleGenerativeAIEmbeddings {
    _convertToContent(text) {
        const req = super._convertToContent(text);
        req.outputDimensionality = 768;
        return req;
    }

    async _embedDocumentsContent(documents) {
        const batchSize = 10;
        const chunks = [];
        for (let i = 0; i < documents.length; i += batchSize) {
            chunks.push(documents.slice(i, i + batchSize));
        }

        const embeddings = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const req = {
                requests: chunk.map((doc) => this._convertToContent(doc))
            };

            console.log(`Embedding batch ${i + 1}/${chunks.length} (size: ${chunk.length})...`);
            
            const res = await this._embedWithRetry(req);
            const batchEmbeddings = res.embeddings.map((e) => e.values || []);
            embeddings.push(...batchEmbeddings);

            if (i < chunks.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 1500));
            }
        }
        return embeddings;
    }

    async _embedWithRetry(req, retries = 5, delay = 6000) {
        try {
            return await this.client.batchEmbedContents(req);
        } catch (err) {
            if ((err.message && (err.message.includes("429") || err.message.includes("Quota exceeded"))) && retries > 0) {
                console.warn(`Rate limit hit (429). Retrying in ${delay / 1000}s...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this._embedWithRetry(req, retries - 1, delay * 2);
            }
            throw err;
        }
    }
}

async function indexing() {
    
    // pdf file ko load kariye
   
const PDF_PATH = path.resolve(__dirname, './VANI_DATA.pdf');
    
const loader = new PDFLoader(PDF_PATH);
const rawDocs = await loader.load(); // 
                                                
    
    //  chunking create karna
    

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // console.log(chunkedDocs.length); 266 chunk --> vector

    // embeding create karni hai
    // configure kar diya hai
    const embeddings = new GoogleGenerativeAIEmbeddings768({
        apiKey: process.env.GOOGLE_API_KEY,
        model: 'gemini-embedding-001',
    });

   console.log("Embedding documents...");

    // configure pinecone

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // clear the old index vectors (hospital data)
    console.log("Clearing all existing vectors from Pinecone index...");
    await pineconeIndex.deleteAll();

    // single step--> ChunkedDocs-->Embedding --> Vector DB

    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });
  console.log("Indexing complete successfully!");
}

indexing();