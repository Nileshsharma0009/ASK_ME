import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PDF_PATH = path.resolve(__dirname, './RagDoc.pdf');

async function testPdfProcessing() {
    console.log("=== Testing PDF Loading & Chunking Pipeline ===");
    console.log(`Loading PDF from: ${PDF_PATH}`);

    try {
        console.log("\n1. Initializing PDFLoader...");
        const loader = new PDFLoader(PDF_PATH);
        
        console.log("Parsing PDF (this might take a few seconds)...");
        const rawDocs = await loader.load();
        
        console.log(`Successfully loaded! Total raw pages/documents: ${rawDocs.length}`);
        if (rawDocs.length > 0) {
            console.log(`Metadata of page 1: ${JSON.stringify(rawDocs[0].metadata)}`);
            console.log(`Character count of page 1: ${rawDocs[0].pageContent.length}`);
            console.log(`Page 1 content snippet:\n"${rawDocs[0].pageContent.substring(0, 300)}..."\n`);
        }

        console.log("2. Initializing RecursiveCharacterTextSplitter...");
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        console.log("Splitting documents into chunks...");
        const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
        console.log(`Total chunked documents generated: ${chunkedDocs.length}`);

        if (chunkedDocs.length > 0) {
            console.log("\nDetails of Chunk #1:");
            console.log(`- Metadata: ${JSON.stringify(chunkedDocs[0].metadata)}`);
            console.log(`- Character length: ${chunkedDocs[0].pageContent.length}`);
            console.log(`- Content:\n"${chunkedDocs[0].pageContent}"`);
            
            if (chunkedDocs.length > 1) {
                console.log("\nDetails of Chunk #2:");
                console.log(`- Metadata: ${JSON.stringify(chunkedDocs[1].metadata)}`);
                console.log(`- Character length: ${chunkedDocs[1].pageContent.length}`);
                console.log(`- Content:\n"${chunkedDocs[1].pageContent}"`);
            }
        }

        console.log("\n✅ PDF Loading and Chunking test finished successfully!");
    } catch (err) {
        console.error("❌ PDF processing failed:");
        console.error(err);
    }
}

testPdfProcessing().catch(console.error);
