import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { configJwt } from "../../config/ConfigSetup";
import sendResponseJson from "../../utils/message";
import HttpStatus from "../../utils/statusCodes";

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return sendResponseJson(
      res,
      HttpStatus.UNAUTHORIZED,
      "Access denied, token missing",
      false
    );

  try {
    const decoded = jwt.verify(
      refreshToken,
      configJwt.jwtRefreshSecret!
    ) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return sendResponseJson(
      res,
      HttpStatus.UNAUTHORIZED,
      "Access denied, invalid token",
      false
    );
  }
};
