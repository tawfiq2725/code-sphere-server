import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configJwt } from "../../config/ConfigSetup";
import { JwtPayloadCustom } from "../../types/express";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token =
    req.cookies.authToken ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ") &&
      req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, configJwt.jwtSecret!) as JwtPayloadCustom;
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("authToken");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
