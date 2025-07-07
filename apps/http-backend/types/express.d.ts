import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // or whatever the type is
    }
  }
}
