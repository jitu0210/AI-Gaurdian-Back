import express from "express"
import dotenv from "dotenv"
import cors from "cors"
// import bodyParser from "body-parser"
import connectDB from "./config/db.js"


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

connectDB()

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`Server is running on ${port}`)
})