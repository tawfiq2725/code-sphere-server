import { Request, Response, NextFunction } from "express";
import User, { UserDocument } from "../../infrastructure/database/userSchema"; // Adjust the import path based on your project structure

interface AuthenticatedRequest extends Request {
  user?: UserDocument;
}

export const checkIfBlocked = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = (await User.findById(req.user._id)) as UserDocument | null;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked" });
    }

    // If not blocked, proceed to the next middleware or route
    next();
  } catch (error) {
    console.error("Error checking user blocked status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
