import express from 'express'
import protect from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.js'
import { uploadVideo,deleteVideo,likeVideo,dislikeVideo,getShareableLink,addComment,reportVideo } from '../controllers/video.controller.js';

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
router.post("/:videoId/comments", protect, addComment)
router.post("/:videoId/report", protect, reportVideo)

export default router