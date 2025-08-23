import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectDB()

const port = process.env.PORT || 8000

import userrouters from "./routes/user.routes.js"

app.use("/api/v1/users", userrouters)


app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})