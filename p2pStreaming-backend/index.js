import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import cors from 'cors';
import vidRouter from './router/videoManagementRouter.js';
import connectDB from './config/dbConnection.js';
import Video from './models/videoModel.js';
import { seedFile, shutdown as shutdownTorrent, getClientStats } from './utils/torrent.js';
dotenv.config()
const port = process.env.PORT || 3000;

// Initialize database connection
await connectDB();

const app = express();

// Enable CORS for frontend
app.use(cors({
	origin: ['http://localhost:5000', 'http://localhost:5173', 'http://127.0.0.1:5000'],
	credentials: true
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/videos', vidRouter);

// Error handling middleware for multer errors
app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({
				success: false,
				error: 'File too large',
				details: 'Maximum file size is 500MB'
			});
		}
		return res.status(400).json({
			success: false,
			error: 'Upload error',
			details: err.message
		});
	}

	if (err) {
		return res.status(400).json({
			success: false,
			error: err.message
		});
	}

	next();
});

// Start seeding existing videos on server startup
async function initializeSeeding() {
	try {
		console.log('🌱 Initializing seeding for existing videos...');
		const videos = await Video.find();

		if (videos.length === 0) {
			console.log('📭 No videos found to seed');
			return;
		}

		console.log(`📦 Found ${videos.length} video(s) to seed`);

		for (const video of videos) {
			try {
				await seedFile(video.filePath);
			} catch (error) {
				console.error(`❌ Failed to seed ${video.filename}:`, error.message);
			}
		}

		// Log seeding stats
		const stats = getClientStats();
		console.log(`✅ Seeding initialized: ${stats.activeTorrents} active torrent(s)`);
	} catch (error) {
		console.error('❌ Error initializing seeding:', error);
	}
}

// Start server
const server = app.listen(port, async () => {
	console.log(`🚀 Server listening on port ${port}`);

	// Initialize seeding after server starts
	await initializeSeeding();
});

// Graceful shutdown handler
process.on('SIGINT', async () => {
	console.log('\n🛑 Received SIGINT, shutting down gracefully...');

	// Close HTTP server
	server.close(() => {
		console.log('✅ HTTP server closed');
	});

	// Shutdown WebTorrent client
	await shutdownTorrent();

	process.exit(0);
});

process.on('SIGTERM', async () => {
	console.log('\n🛑 Received SIGTERM, shutting down gracefully...');

	// Close HTTP server
	server.close(() => {
		console.log('✅ HTTP server closed');
	});

	// Shutdown WebTorrent client
	await shutdownTorrent();

	process.exit(0);
});