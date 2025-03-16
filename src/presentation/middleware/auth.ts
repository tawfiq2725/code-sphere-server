import { Request, RequestHandler, Response, NextFunction } from "express";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import { verifyAccessToken, TokenPayload } from "../../utils/tokenUtility";
import userSchema from "../../infrastructure/database/userSchema";

export const verifyToken = (allowedRoles?: string[]): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const authHeader =
      (req.headers.Authorization as string) ||
      (req.headers.authorization as string);

    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      !authHeader.startsWith("Bearer ")
    ) {
      return sendResponseJson(
        res,
        HttpStatus.UNAUTHORIZED,
        "No token provided",
        false
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyAccessToken(token) as TokenPayload;
      console.log("Access token decoded:", decoded);

      let user: any = null;

      if (decoded.role === "admin") {
        user = await userSchema.findOne({ email: decoded.email });
      } else if (decoded.role === "student") {
        user = await userSchema.findOne({ email: decoded.email });
      } else if (decoded.role === "tutor") {
        user = await userSchema.findOne({ email: decoded.email });
      }

      if (!user && decoded.role !== "admin") {
        return sendResponseJson(
          res,
          HttpStatus.UNAUTHORIZED,
          "User not found",
          false
        );
      }

      if (user && user.isBlocked) {
        return sendResponseJson(
          res,
          HttpStatus.FORBIDDEN,
          "User is blocked",
          false
        );
      }

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return sendResponseJson(
          res,
          HttpStatus.UNAUTHORIZED,
          "Access denied: insufficient permissions",
          false
        );
      }
      (req as any).user = decoded;
      next();
    } catch (error) {
      console.error("Access token verification error:", error);
      return sendResponseJson(
        res,
        HttpStatus.UNAUTHORIZED,
        "Invalid or expired token",
        false
      );
    }
  };
};
