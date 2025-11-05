import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Routes
router.post("/register", protect, isAdmin, registerUser);
router.post("/login", loginUser);

export default router;
