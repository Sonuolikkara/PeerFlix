import { seedFile, getClientStats } from "../utils/torrent.js";
import Video from "../models/videoModel.js";
import path from "path";

const uploadVideo = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No video file uploaded"
            });
        }

        // Get videoId from multer middleware (set in multerConfig.js)
        const videoId = req.videoId;

        // Seed the file to create magnet URI
        const { magnetURI, infoHash } = await seedFile(req.file.path);

        // Create video document in database
        const video = new Video({
            videoId,
            filename: req.file.filename,
            originalFilename: req.file.originalname,
            filePath: req.file.path,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            magnetURI
        });

        await video.save();

        // Return success response with video details
        res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            data: {
                videoId,
                filename: req.file.filename,
                originalFilename: req.file.originalname,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                filePath: req.file.path,
                magnetURI,
                infoHash,
                uploadedAt: video.uploadedAt
            }
        });

    } catch (error) {
        console.error("Error uploading video:", error);

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: "Validation error",
                details: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                error: "Video with this ID already exists"
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            error: "Failed to upload video",
            details: error.message
        });
    }
};

// List all videos
const listVideos = async (req, res) => {
    try {
        // Retrieve all videos, sorted by upload date (newest first)
        const videos = await Video.find()
            .sort({ uploadedAt: -1 })
            .select('-__v'); // Exclude version key

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos
        });

    } catch (error) {
        console.error("Error listing videos:", error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve videos",
            details: error.message
        });
    }
};

// Get video by ID
const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find video by videoId
        const video = await Video.findOne({ videoId: id }).select('-__v');

        if (!video) {
            return res.status(404).json({
                success: false,
                error: "Video not found"
            });
        }

        res.status(200).json({
            success: true,
            data: video
        });

    } catch (error) {
        console.error("Error retrieving video:", error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve video",
            details: error.message
        });
    }
};

// Get magnet URI only
const getMagnetUri = async (req, res) => {
    try {
        const { id } = req.params;

        // Find video by videoId, select only magnetURI field
        const video = await Video.findOne({ videoId: id }).select('magnetURI');

        if (!video) {
            return res.status(404).json({
                success: false,
                error: "Video not found"
            });
        }

        res.status(200).json({
            success: true,
            magnetURI: video.magnetURI
        });

    } catch (error) {
        console.error("Error retrieving magnet URI:", error);
        res.status(500).json({
            success: false,
            error: "Failed to retrieve magnet URI",
            details: error.message
        });
    }
};

// Get seeding statistics
const getStats = (req, res) => {
    try {
        const stats = getClientStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({
            success: false,
            error: "Failed to get seeding statistics",
            details: error.message
        });
    }
};

export { uploadVideo, listVideos, getVideoById, getMagnetUri, getStats };