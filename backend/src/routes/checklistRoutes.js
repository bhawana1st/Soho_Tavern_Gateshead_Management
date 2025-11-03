import express from "express";
import { createChecklist, getChecklists } from "../controllers/checklistController.js";

const router = express.Router();

router.post("/", createChecklist); // Add checklist
router.get("/", getChecklists); // Get all checklists

export default router;
