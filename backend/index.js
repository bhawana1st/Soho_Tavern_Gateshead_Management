// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import checklistRoutes from "./src/routes/checklistRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/checklist", checklistRoutes);
app.use("/api/users", userRoutes);

// Root
app.get("/", (req, res) => res.send("✅ Soho Tavern API Running..."));

// Error handler (must be at the end)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

export default app;
