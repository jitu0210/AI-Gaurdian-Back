import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    subscriptions:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    watchLater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    },
    likedVideos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    },
    dislikedVideos:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    },
    history:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"History",
    }
},{timestamps:true}
)

export const User = mongoose.model("User", userSchema)