import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
import { chatting } from './query.js';
async function main() {
    try {
        console.log("Calling chatting('Where is X-Ray located?')...");
        const ans = await chatting("Where is X-Ray located?");
        console.log("Response from chatting RAG pipeline:");
        console.log(ans);
    } catch (err) {
        console.error("Chatting function failed with error:");
        console.error(err);
    }
}
main().catch(console.error);
