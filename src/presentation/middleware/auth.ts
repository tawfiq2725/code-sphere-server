// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { configJwt } from "../../config/ConfigSetup";
// import { JwtPayloadCustom } from "../../types/express";

// export const authenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): any => {
//   const token =
//     req.cookies.authToken ||
//     (req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ") &&
//       req.headers.authorization.split(" ")[1]);

//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" });
//   }

//   try {
//     const decoded = jwt.verify(token, configJwt.jwtSecret!) as JwtPayloadCustom;
//     req.user = decoded;

//     next();
//   } catch (err) {
//     res.clearCookie("authToken");
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// middleware/authMiddleware.ts
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
    console.log("🔒 Verifying access token...");
    const authHeader =
      (req.headers.Authorization as string) ||
      (req.headers.authorization as string);
    console.log("🔒 Verifying access token...", authHeader);
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
          HttpStatus.UNAUTHORIZED,
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

// // authMiddleware.ts
// import { Request, Response, NextFunction } from "express";
// import { verifyAccessToken, TokenPayload } from "../../utils/tokenUtility";

// export interface AuthRequest extends Request {
//   user?: TokenPayload;
// }

// export function authenticateToken(allowedRoles: string[] = []) {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1];
//     if (!token) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const payload = verifyAccessToken(token);
//     if (!payload) {
//       return res.status(403).json({ message: "Invalid or expired token" });
//     }
//     if (
//       allowedRoles.length > 0 &&
//       !allowedRoles.some((role) => payload.roles.includes(role))
//     ) {
//       return res
//         .status(403)
//         .json({ message: "Access denied: insufficient permissions" });
//     }

//     req.user = payload;
//     next();
//   };
// }
