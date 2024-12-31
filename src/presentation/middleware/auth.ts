import { Request, Response, NextFunction } from "express";
import "../../types/express";
import jwt from "jsonwebtoken";
import { configJwt } from "../../config/ConfigSetup";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, configJwt.jwtSecret!);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("authToken");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
