import express from "express";
import protect from "../middlewares/auth.middleware.js"
import {addComment , deleteComment} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/:videoId", protect, addComment);
router.delete("/:commentId", protect, deleteComment);

export default router;