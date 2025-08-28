import { Router } from "express";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/**
 * PUBLIC_INTERFACE
 * POST /api/auth/register
 * Body: { email, password, name? }
 * Returns: { token, user: { id, email, name } }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already in use" });
    }
    const user = await User.create({ email, password, name });
    const token = signToken({ sub: user._id.toString(), email: user.email });
    return res.status(201).json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name || "" }
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

/**
 * PUBLIC_INTERFACE
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, email, name } }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken({ sub: user._id.toString(), email: user.email });
    return res.json({
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name || "" }
    });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

/**
 * PUBLIC_INTERFACE
 * GET /api/auth/me
 * Header: Authorization: Bearer <token>
 * Returns: { id, email, name }
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.sub;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ id: user._id.toString(), email: user.email, name: user.name || "" });
  } catch (e) {
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});

export default router;
