import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pinecone } from '@pinecone-database/pinecone';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME;

async function testPinecone() {
    console.log("=== Testing Pinecone Vector Database Connection ===");

    if (!apiKey || !indexName) {
        console.error("❌ PINECONE_API_KEY or PINECONE_INDEX_NAME is missing in backend/.env!");
        return;
    }

    console.log(`Pinecone API Key: Found (starts with ${apiKey.substring(0, 8)}...)`);
    console.log(`Pinecone Index Name: "${indexName}"`);

    try {
        console.log("\n1. Initializing Pinecone client...");
        const pc = new Pinecone({ apiKey: apiKey });

        console.log("Listing index names...");
        const response = await pc.listIndexes();
        const indexes = response.indexes || [];
        console.log("Existing Pinecone Indexes:");
        indexes.forEach(idx => {
            console.log(`- ${idx.name} (Dimension: ${idx.dimension}, Metric: ${idx.metric}, Host: ${idx.host})`);
        });

        const indexExists = indexes.some(idx => idx.name === indexName);
        if (!indexExists) {
            console.error(`❌ Index "${indexName}" does not exist in your Pinecone account! Please create it.`);
            return;
        }

        console.log(`\n2. Describing Pinecone index "${indexName}"...`);
        const indexDescription = await pc.describeIndex(indexName);
        console.log(`Status: ${JSON.stringify(indexDescription.status)}`);
        console.log(`Dimension: ${indexDescription.dimension}`);
        console.log(`Metric: ${indexDescription.metric}`);

        console.log(`\n3. Describing index stats (vector count, namespaces)...`);
        const index = pc.Index(indexName);
        const stats = await index.describeIndexStats();
        
        console.log(`Total vector count: ${stats.totalRecordCount}`);
        console.log("Namespaces stats:");
        if (stats.namespaces && Object.keys(stats.namespaces).length > 0) {
            for (const [ns, details] of Object.entries(stats.namespaces)) {
                console.log(`- Namespace: "${ns}" (Record count: ${details.recordCount})`);
            }
        } else {
            console.log("- No namespaces found (using default namespace).");
        }

        console.log("\n✅ Pinecone Connection & Query Stats verified successfully!");
    } catch (err) {
        console.error("❌ Pinecone operations failed with error:");
        console.error(err);
    }
}

testPinecone().catch(console.error);
