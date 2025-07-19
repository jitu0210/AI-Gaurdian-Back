import cloudinary from "../config/cloudinary.js";
import Video from "../models/Video.model.js";
import nodemailer from "nodemailer";
import Comment from "../models/Comment.model.js";
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
  const video = await Video.findById(req.params.id);
  const userId = req.user._id;

  if (!video.likes.includes(userId)) {
    video.likes.push(userId);
    video.dislikes = video.dislikes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }

  await video.save();
  res.json({ message: "Video liked" });
};

const dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const userId = req.user._id;

  if (!video.dislikes.includes(userId)) {
    video.dislikes.push(userId);
    video.likes = video.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
  }

  await video.save();
  res.json({ message: "Video disliked" });
};

const getShareableLink = async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) return res.status(404).json({ error: "Video not found" });

  const link = `${process.env.FRONTEND_URL}/watch/${video._id}`;
  res.json({ link });
};

const addComment = async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id,
    content,
  });

  res.status(201).json(comment);
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

export {
  uploadVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  getShareableLink,
  addComment,
  reportVideo,
};
