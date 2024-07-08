import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Users, Iuser } from "../../../../infrastructure/database/dbmodel/userModel";
import { Vendor,VendorDocument } from "../../../../infrastructure/database/dbmodel/vendorModel";

export const protectVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const decoded = jwt.verify(tokenWithoutBearer, secretKey) as JwtPayload & { vendorId: string };
    console.log({decoded})

    if (decoded && typeof decoded === 'object' && 'vendor' in decoded && 'exp' in decoded) {
      const vendorId = decoded.vendor;
      const vendor: VendorDocument | null = await Vendor.findById(vendorId);
      if (!vendor) {
         res.status(401).json({ message: "User not found" });
         return
      }
    //   if (vendor.is_blocked) {
    //      res.status(401).json({ message: "User is blocked" });
    //      return
    //   }
      (req as any).locals = { vendor };
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
