import express from "express"
import { chatWithPdf } from "../controllers/chat.controller.js"

const router = express.Router()

router.post("/", chatWithPdf)

export default router;