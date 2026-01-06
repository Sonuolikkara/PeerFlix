import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
    try {
        const connectDB = await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("Database Connected:",connectDB.connection.host);
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB;