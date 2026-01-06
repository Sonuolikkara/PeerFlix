import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// File size limit: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

// Allowed video MIME types
const ALLOWED_MIME_TYPES = [
    'video/mp4',
    'video/avi',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-matroska',
    'video/webm'
];

// Allowed file extensions
const ALLOWED_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];

// Create disk storage engine with dynamic directory creation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Generate unique videoId and attach to request
        const videoId = randomUUID();
        req.videoId = videoId;

        // Create video-specific directory: /videos/{videoId}/
        const videoDir = path.join(process.cwd(), 'videos', videoId);

        // Ensure directory exists
        fs.mkdirSync(videoDir, { recursive: true });

        cb(null, videoDir);
    },
    filename: (req, file, cb) => {
        // Preserve original file extension
        const ext = path.extname(file.originalname);
        // Save as original.{ext}
        cb(null, `original${ext}`);
    }
});

// File filter for validation
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    console.log('File upload attempt:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        extension: ext
    });

    // Check file extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return cb(new Error(`Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`), false);
    }

    // Check MIME type - also accept application/octet-stream as browsers sometimes send this
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype) && file.mimetype !== 'application/octet-stream') {
        return cb(new Error(`Invalid MIME type. Received: ${file.mimetype}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`), false);
    }

    cb(null, true);
};

// Configure multer with storage, file filter, and size limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

export { upload };