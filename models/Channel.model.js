import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    immutable: true 
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },
  avatar: {
    type: String,
    default: "https://example.com/default-avatar.jpg"
  },
  banner: {
    type: String,
    default: "https://example.com/default-banner.jpg"
  },
  verified: {
    type: Boolean,
    default: false
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }],
  socialLinks: {
    website: String,
    twitter: String,
    instagram: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true } 
});

channelSchema.virtual('subscribersCount').get(function() {
  return this.subscribers.length;
});

channelSchema.virtual('videosCount').get(function() {
  return this.videos.length;
});

const Channel = mongoose.models.Channel || mongoose.model("Channel", channelSchema);

export default Channel;