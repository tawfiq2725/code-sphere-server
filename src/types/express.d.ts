import { JwtPayload } from "jsonwebtoken";
export interface JwtPayloadCustom extends JwtPayload {
  userId: string;
  email: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayloadCustom;
    }
  }
}
