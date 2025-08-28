import { verifyToken } from "../utils/jwt.js";

// PUBLIC_INTERFACE
export function requireAuth(req, res, next) {
  /**
   * Express middleware to verify JWT in Authorization header (Bearer token).
   * Attaches decoded user to req.user when valid.
   */
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
