import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Users, Iuser } from "../../../../infrastructure/database/dbmodel/userModel";

export const protectUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    console.log("No token or invalid format");
     res.status(401).json({ message: "Not authorized, no token or invalid format" });
     return
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    console.log("Token without Bearer:", tokenWithoutBearer);

    const secretKey: string = process.env.JWT_SECRET || "";
    const decoded = jwt.verify(tokenWithoutBearer, secretKey) as JwtPayload & { userId: string };
    console.log({decoded})

    if (decoded && typeof decoded === 'object' && 'user' in decoded && 'exp' in decoded) {
      const userId = decoded.user;
      const user: Iuser | null = await Users.findById(userId);
      if (!user) {
         res.status(401).json({ message: "User not found" });
         return
      }
      if (user.is_blocked) {
         res.status(401).json({ message: "User is blocked" });
         return
      }
      (req as any).locals = { user };
      next();
    } else {
      throw new Error('Invalid token format');
    }
  } catch (error) {
    console.error("Error verifying token:", error);
     res.status(401).json({ message: "Not authorized, invalid token" });
     return
  }
};
