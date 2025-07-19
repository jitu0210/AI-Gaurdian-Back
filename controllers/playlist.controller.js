import Playlist from "../models/Playlist.model.js";
import Video from "../models/Video.model.js";

// Create a new playlist
const createPlaylist = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newPlaylist = await Playlist.create({
      user: userId,
      title,
      description,
      isPublic
    });

    res.status(201).json({
      message: "Playlist created successfully",
      playlist: newPlaylist
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to create playlist", 
      details: err.message 
    });
  }
};

// Add video to playlist
const addVideoToPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    // Check if playlist exists and belongs to user
    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: userId
    });

    if (!playlist) {
      return res.status(404).json({ 
        error: "Playlist not found or you don't have permission" 
      });
    }

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Check if video already exists in playlist
    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ 
        error: "Video already exists in playlist" 
      });
    }

    // Add video to playlist
    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json({
      message: "Video added to playlist successfully",
      playlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to add video to playlist", 
      details: err.message 
    });
  }
};

// Remove video from playlist
const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    // Check if playlist exists and belongs to user
    const playlist = await Playlist.findOne({
      _id: playlistId,
      user: userId
    });

    if (!playlist) {
      return res.status(404).json({ 
        error: "Playlist not found or you don't have permission" 
      });
    }

    // Check if video exists in playlist
    if (!playlist.videos.includes(videoId)) {
      return res.status(404).json({ 
        error: "Video not found in playlist" 
      });
    }

    // Remove video from playlist
    playlist.videos = playlist.videos.filter(
      id => id.toString() !== videoId.toString()
    );
    await playlist.save();

    res.status(200).json({
      message: "Video removed from playlist successfully",
      playlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to remove video from playlist", 
      details: err.message 
    });
  }
};

// Delete entire playlist
const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user._id;

    // Check if playlist exists and belongs to user
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      user: userId
    });

    if (!playlist) {
      return res.status(404).json({ 
        error: "Playlist not found or you don't have permission" 
      });
    }

    res.status(200).json({
      message: "Playlist deleted successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to delete playlist", 
      details: err.message 
    });
  }
};

// Get user's playlists
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user._id;

    const playlists = await Playlist.find({ user: userId })
      .populate('videos', 'title thumbnail url')
      .sort({ createdAt: -1 });

    res.status(200).json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: "Failed to fetch playlists", 
      details: err.message 
    });
  }
};

export {
  createPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  getUserPlaylists
};