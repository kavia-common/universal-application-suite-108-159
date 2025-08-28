import jwt from "jsonwebtoken";

// PUBLIC_INTERFACE
export function signToken(payload) {
  /** Sign a JWT with configured secret and expiry. */
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.sign(payload, secret, { expiresIn });
}

// PUBLIC_INTERFACE
export function verifyToken(token) {
  /** Verify a JWT and return the decoded payload. */
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.verify(token, secret);
}
