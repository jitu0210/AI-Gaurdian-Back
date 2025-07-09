import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()

const connectDB =async()=>{
    try {
        await mongoose.connect(
            process.env.MONGO_URL,{
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        ).then(()=>{
            console.log("Connected to database successfully...")
        })
    } catch (error) {
        console.log(error,"Database connection failed...")
    }
} 

export default connectDB;