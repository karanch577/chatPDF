import express from "express"
import 'dotenv/config'
import cors from "cors"
import morgan from "morgan"
import projectRoutes from "./routers/project.js"
import chatRoutes from "./routers/chat.js"

const app = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    // origin: ["https://sneakerx-frontend.vercel.app"],
    origin: ["http://localhost:3000"],
    credentials: true,
}))
app.use(morgan("tiny"))

app.use("/api/project", projectRoutes)
app.use("/api/chat", chatRoutes)

app.get("/", (req, res) => {
    res.status(200).json({
        message: "hello from the server"
    })
})

app.listen(process.env.PORT || 4001, () => {
    console.log(`Server is running on port ${process.env.PORT || 4001}`)
})