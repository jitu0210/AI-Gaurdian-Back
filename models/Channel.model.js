import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    subscribers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    videos:{
        type:Array,
        default:[],
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    avatar:{
        type:String,
    },
    banner:{
        type:String,
    },
    verified:{
        type:Boolean,
        default:false,
    },
    subscribersCount:{
        type:Number,
        default:0,
    },
    videosCount:{
        type:Number,
        default:0,
    }
},{timestamps:true})

const Channel = mongoose.model("Channel", channelSchema)

export default Channel;