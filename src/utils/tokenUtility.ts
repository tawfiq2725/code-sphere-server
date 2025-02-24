import jwt from "jsonwebtoken";

export interface TokenPayload {
  id: string;
  email: string;
  role: "student" | "tutor" | "admin";
}

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: "30d" });
}
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, accessTokenSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, refreshTokenSecret) as TokenPayload;
  } catch (error) {
    return null;
  }
}
