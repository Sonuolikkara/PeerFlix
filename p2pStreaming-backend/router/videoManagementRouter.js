import { Router } from "express";
import { upload } from "../config/multerConfig.js";
import { uploadVideo, listVideos, getVideoById, getMagnetUri, getStats } from "../controllers/videoController.js";
const vidRouter = Router();

// POST route for video upload
vidRouter.post('/upload', upload.single('video'), uploadVideo);

// GET routes for video metadata
vidRouter.get('/', listVideos);
vidRouter.get('/stats', getStats); // Seeding statistics
vidRouter.get('/:id/magnet', getMagnetUri); // Must come before /:id route
vidRouter.get('/:id', getVideoById);

export default vidRouter;