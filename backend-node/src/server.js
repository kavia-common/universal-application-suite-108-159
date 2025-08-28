import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Health route
// PUBLIC_INTERFACE
app.get("/health", (req, res) => {
  /**
   * Health check endpoint
   * Returns a simple status for monitoring and CI.
   */
  res.json({ status: "ok", service: "AI Smart Finance Buddy (Node)" });
});

// Routes
app.use("/api/auth", authRoutes);

// Mongo connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI env var");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { autoIndex: true })
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Backend listening on :${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
