import { Request, Response, NextFunction } from "express";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
} from "../../utils/tokenUtility";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  const accessPayload = verifyAccessToken(accessToken);
  if (accessPayload) {
    req.user = accessPayload;
    return next();
  }

  if (!refreshToken) {
    res.status(403).json({ message: "Refresh token required" });
    return;
  }

  const refreshPayload = verifyRefreshToken(refreshToken);
  if (!refreshPayload) {
    res.status(403).json({ message: "Invalid refresh token" });
    return;
  }

  const newAccessToken = generateAccessToken({
    id: refreshPayload.id,
    email: refreshPayload.email,
    role: refreshPayload.role,
  });

  res.setHeader("Authorization", `Bearer ${newAccessToken}`);
  req.user = refreshPayload;

  return next();
};
