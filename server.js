import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import bodyParser from "body-parser";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectDB()

const port = process.env.PORT || 8000

import userrouters from "./routes/user.routes.js"
import videoroutes from "./routes/video.routes.js"
import playlistRoutes from './routes/playlist.routes.js';
import channelRoutes from './routes/channel.routes.js';
import historyroutes from "./routes/history.routes.js"
import commentroutes from "./routes/comment.routes.js"

app.use("/api/v1/users", userrouters)
app.use("/api/v1/videos", videoroutes)
app.use('/api/v1/playlists', playlistRoutes)
app.use('/api/v1/channels' , channelRoutes)
app.use("/api/v1/history", historyroutes)
app.use("/api/v1/comment", commentroutes)

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})