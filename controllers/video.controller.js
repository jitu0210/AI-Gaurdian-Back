import cloudinary from "../config/cloudinary.js";
import Video from "../models/Video.model.js";
import nodemailer from "nodemailer";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id;

    if (!req.files?.video || !req.files?.thumbnail) {
      return res.status(400).json({ error: "Video and thumbnail required" });
    }

    const videoResult = await uploadToCloudinary(req.files.video[0].buffer, {
      resource_type: "video",
      folder: "yt/videos",
    });

    const thumbnailResult = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      {
        folder: "yt/thumbnails",
      }
    );

    const newVideo = await Video.create({
      title,
      description,
      uploader: req.user._id,
      url: videoResult.secure_url,
      thumbnail: thumbnailResult.secure_url,
      cloudinaryVideoId: videoResult.public_id,
      cloudinaryThumbnailId: thumbnailResult.public_id,
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
      shareableLink: `${process.env.FRONTEND_URL}/watch/${newVideo._id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    console.log("Logged-in user:", req.user._id);
    console.log("Raw uploader:", video.uploader);

    const uploaderId =
      video.uploader && video.uploader._id
        ? video.uploader._id
        : video.uploader;

    console.log("Uploader ID to compare:", uploaderId);

    if (String(video.uploader) !== String(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Cloudinary deletions...
    if (video.cloudinaryVideoId) {
      await cloudinary.uploader.destroy(video.cloudinaryVideoId, {
        resource_type: "video",
      });
    }

    if (video.cloudinaryThumbnailId) {
      await cloudinary.uploader.destroy(video.cloudinaryThumbnailId);
    }

    await video.deleteOne();
    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Video Deletion Error:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user._id;

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const liked = video.likes.includes(userId);
    const disliked = video.dislikes.includes(userId);

    if (liked) {
      // Unlike the video
      video.likes.pull(userId);
      await video.save();
      return res.json({ message: "Video unliked" });
    }

    // Like the video
    video.likes.push(userId);

    if (disliked) {
      // Remove dislike if previously disliked
      video.dislikes.pull(userId);
    }

    await video.save();
    return res.json({ message: "Video liked" });
  } catch (error) {
    console.error("Like Video Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const userId = req.user._id;

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    const disliked = video.dislikes.includes(userId);
    const liked = video.likes.includes(userId);

    if (disliked) {
      // Remove dislike
      video.dislikes.pull(userId);
      await video.save();
      return res.json({ message: "Video undisliked" });
    }

    // Add dislike
    video.dislikes.push(userId);

    if (liked) {
      // Remove like if previously liked
      video.likes.pull(userId);
    }

    await video.save();
    return res.json({ message: "Video disliked" });
  } catch (error) {
    console.error("Dislike Video Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const watchVideo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const alreadyViewed = video.viewedBy.includes(userId);

    if (!alreadyViewed) {
      video.views += 1;
      video.viewedBy.push(userId);
      await video.save();
    }

    res.json({ message: "Video fetched", video });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


const getShareableLink = async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ error: "Video not found" });

  const link = `${process.env.FRONTEND_URL}/watch/${video._id}`;
  res.json({ link });
};


const reportVideo = async (req, res) => {
  const { videoId } = req.params;
  const { reason } = req.body;

  const video = await Video.findById(videoId).populate(
    "uploader",
    "username email"
  );
  if (!video) return res.status(404).json({ error: "Video not found" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.DEV_EMAIL,
      pass: process.env.DEV_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: req.user.email,
    to: process.env.DEV_EMAIL,
    subject: `Video Reported - ${video.title}`,
    html: `
      <p><strong>Reported By:</strong> ${req.user.email}</p>
      <p><strong>Video ID:</strong> ${video._id}</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Watch Link:</strong> <a href="${process.env.FRONTEND_URL}/watch/${video._id}">Watch Video</a></p>
    `,
  };

  await transporter.sendMail(mailOptions);

  res.json({ message: "Report sent to developer" });
};

const getMyVideos = async (req, res) => {
  try {
    const userId = req.user._id;

    const videos = await Video.find({ uploader: userId });

    return res.status(200).json({ success: true, videos });
  } catch (error) {
    console.error("Get My Videos Error:", error);
    return res.status(500).json({ error: "Server error while fetching your videos" });
  }
};

export {
  uploadVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  watchVideo,
  getShareableLink,
  reportVideo,
  getMyVideos,
};
