import { Request, Response } from "express";
import HttpStatus from "../../utils/statusCodes";
import sendResponseJson from "../../utils/message";
import {
  generateAccessToken,
  TokenPayload,
  verifyRefreshToken,
} from "../../utils/tokenUtility";
const refresh = (req: Request, res: Response): any => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return sendResponseJson(
      res,
      HttpStatus.UNAUTHORIZED,
      "No refresh token received!",
      false
    );
  }

  try {
    const decoded = verifyRefreshToken(refreshToken) as TokenPayload;
    const accessToken = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    return sendResponseJson(
      res,
      HttpStatus.OK,
      "Access token refreshed successfully!",
      true,
      accessToken
    );
  } catch (error) {
    return sendResponseJson(
      res,
      HttpStatus.FORBIDDEN,
      "Invalid refresh token!",
      false
    );
  }
};

export default refresh;
