import Video from "../models/Video.model.js"
import Comment from "../models/Comment.model.js"

const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      content,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only the comment owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete Comment Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export {
    addComment,
    deleteComment
}