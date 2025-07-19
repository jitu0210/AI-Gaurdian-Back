import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 500
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    validate: {
      validator: async function(videoId) {
        const video = await mongoose.model('Video').findById(videoId);
        return video !== null;
      },
      message: props => `Video with ID ${props.value} does not exist`
    }
  }],
  isPublic: { 
    type: Boolean, 
    default: false 
  },
  thumbnail: {
    type: String,
    default: function() {
      return "https://example.com/default-playlist-thumbnail.jpg";
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

playlistSchema.virtual('videoCount').get(function() {
  return this.videos.length;
});

const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', playlistSchema);

export default Playlist;