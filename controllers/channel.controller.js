import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const getOrCreateChannel = async (req, res) => {
  try {
    const userId = req.user._id;
    let channel = await Channel.findOne({ owner: userId })
      .populate('owner', 'username email avatar')
      .populate('videos', 'title thumbnail duration');

    if (!channel) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      channel = await Channel.create({
        owner: userId,
        name: `${user.username}'s Channel`,
        avatar: user.avatar || 'https://example.com/default-avatar.jpg',
        banner: 'https://example.com/default-banner.jpg'
      });
    }

    res.status(200).json(channel);
  } catch (err) {
    console.error("Channel Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// Update Channel
const updateChannel = async (req, res) => {
  try {
    const { name, description, socialLinks } = req.body;
    
    if (name && name.length > 50) {
      return res.status(400).json({ error: "Name must be less than 50 characters" });
    }

    const channel = await Channel.findOneAndUpdate(
      { owner: req.user._id },
      { 
        name, 
        description: description || "",
        socialLinks: socialLinks || {}
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('owner', 'username avatar');

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ 
      error: "Update failed", 
      details: err.message 
    });
  }
};

// Upload Avatar/Banner
const uploadChannelImage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['avatar', 'banner'].includes(type)) {
      return res.status(400).json({ error: "Invalid image type" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    // Stream upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `channel_${type}s` },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: "Image upload failed" });
        }

        channel[type] = result.secure_url;
        await channel.save();
        
        res.status(200).json({ 
          [type]: channel[type],
          message: `${type} updated successfully`
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ 
      error: "Upload failed", 
      details: err.message 
    });
  }
};

// Subscribe/Unsubscribe
const toggleSubscription = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    if (channelId === userId.toString()) {
      return res.status(400).json({ error: "Cannot subscribe to yourself" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const isSubscribed = channel.subscribers.some(sub => sub._id.equals(userId));
    
    if (isSubscribed) {
      channel.subscribers.pull(userId);
    } else {
      channel.subscribers.push(userId);
    }

    await channel.save();
    
    res.status(200).json({ 
      subscribed: !isSubscribed,
      subscribersCount: channel.subscribers.length,
      message: isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully"
    });
  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ 
      error: "Subscription action failed", 
      details: err.message 
    });
  }
};

// Get Channel by ID
const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate({
        path: 'owner',
        select: 'username avatar verified'
      })
      .populate({
        path: 'videos',
        select: 'title thumbnail url views duration createdAt',
        options: { sort: { createdAt: -1 } }
      })
      .populate({
        path: 'subscribers',
        select: 'username avatar',
        options: { limit: 10 }
      });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // Convert to plain object to add virtuals
    const channelObj = channel.toObject();
    channelObj.subscribersCount = channel.subscribers.length;
    channelObj.videosCount = channel.videos.length;

    res.status(200).json(channelObj);
  } catch (err) {
    console.error("Get Channel Error:", err);
    res.status(500).json({ 
      error: "Failed to fetch channel", 
      details: err.message 
    });
  }
};

export {
  getOrCreateChannel,
  updateChannel,
  uploadChannelImage,
  toggleSubscription,
  getChannel
};