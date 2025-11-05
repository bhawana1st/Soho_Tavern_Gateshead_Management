import express from "express";
import {
  saveChecklist,
  getAllChecklists,
  getChecklistByDate,
  deleteChecklist,
} from "../controllers/checklistController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isEditorOrAdmin, canView } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create or update - only admin and editor
router.post("/", protect, isEditorOrAdmin, saveChecklist);

// List all - all authenticated users can view
router.get("/", protect, canView, getAllChecklists);

// Get by date - all authenticated users can view
router.get("/:date", protect, canView, getChecklistByDate);

router.delete("/:id", protect, isEditorOrAdmin, deleteChecklist);

export default router;
