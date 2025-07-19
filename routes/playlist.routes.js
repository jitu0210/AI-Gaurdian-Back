import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  getUserPlaylists
} from '../controllers/playlist.controller.js';

const router = express.Router();

router.post("/", protect, createPlaylist);
router.get("/", protect, getUserPlaylists);
router.post("/:playlistId/videos/:videoId", protect, addVideoToPlaylist);
router.delete("/:playlistId/videos/:videoId", protect, removeVideoFromPlaylist);
router.delete("/:playlistId", protect, deletePlaylist);

export default router;