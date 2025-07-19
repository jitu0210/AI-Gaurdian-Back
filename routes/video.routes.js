import express from 'express'
import protect from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'
import { uploadVideo,deleteVideo,likeVideo,dislikeVideo,watchVideo,getShareableLink,reportVideo,getMyVideos } from '../controllers/video.controller.js';

const router = express.Router()

router.post("/upload", protect, upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
])
, uploadVideo);
router.delete("/:id", protect, deleteVideo)
router.post("/:id/like", protect, likeVideo)
router.post("/:id/dislike", protect, dislikeVideo)
router.get("/:videoId/share", getShareableLink)
router.post("/:videoId/report", protect, reportVideo)
router.get("/my-videos", protect, getMyVideos);
router.get("/:videoId/watch", protect, watchVideo);


export default router