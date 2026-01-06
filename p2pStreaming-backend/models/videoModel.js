import mongoose, { mongo } from "mongoose";

const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true,
    },
    filename: {
        type: String,
        required: true,
    },
    originalFilename: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    magnetURI: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Video", videoSchema);