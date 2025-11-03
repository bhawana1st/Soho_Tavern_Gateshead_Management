// Import modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import checklistRoutes from "./src/routes/checklistRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("✅ Soho Tavern Backend API is running successfully!");
});

// Routes
app.use("/api/checklist", checklistRoutes); // checklist routes
app.use("/api/auth", authRoutes); // authentication routes (register/login)

// Error handler middleware (should be at last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
