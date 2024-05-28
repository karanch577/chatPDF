import express from "express"
import upload from "../utils/uploadPdf.js"
import { addProject, getProjectDetails, listProjects } from "../controllers/project.controller.js"

const router = express.Router()

router.post("/add", upload.single("pdf"), addProject)
router.get("/list", listProjects)
router.get("/detail", getProjectDetails)

export default router;