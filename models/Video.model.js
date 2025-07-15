import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
   
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    url:{
        type:String,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    likes:{
        type:Number,
        default:0,
    },
    dislikes:{
        type:Number,
        default:0,
    },
    comments:{
        type:Array,
        default:[],
    }
},{timestamps:true}
)

const Video = mongoose.model("Video", videoSchema);

export default Video