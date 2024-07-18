// import { NextFunction, Response, Request } from "express";
// import jwt from 'jsonwebtoken';
// import { Vendor, VendorDocument } from "../../../../infrastructure/database/dbmodel/vendorModel";
// import { log } from "console";

// // Extend the express Request interface to include vendor property
// declare module 'express-serve-static-core' {
//     interface Request {
//         vendor?: VendorDocument;
//     }
// }

// export const protectVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const token = req.header("Authorization");

//     log("tokenvendormidd",token)
//     if (!token || !token.startsWith("Bearer ")) {
//         console.log("No token or invalid format");
//         res.status(401).json({ message: "Not authorized, no token or invalid format" });
//         return;
//     }

//     try {
//         const tokenWithoutBearer = token.replace("Bearer ", "");
//         console.log("Token without Bearer:", tokenWithoutBearer);

//         const secretKey: string = process.env.JWT_SECRET || "";
//         const decoded = jwt.verify(tokenWithoutBearer, secretKey) as { user: string, role: string, exp: number };

//         console.log({ decoded });

//         if (decoded && typeof decoded === 'object' && 'user' in decoded && 'exp' in decoded) {
//             const vendorId = decoded.user;
//             console.log(vendorId, "✅");

//             const vendor: VendorDocument | null = await Vendor.findById(vendorId);
//             if (!vendor) {
//                 res.status(401).json({ message: "Vendor not found" });
//                 return;
//             }
//             if (vendor.is_blocked) {
//                 res.status(401).json({ message: "Vendor is blocked" });
//                 return;
//             }

//             req.vendor = vendor;
//             if(decoded.role = 'vendor'){
//               next();
//             }
            
//         } else {
//             throw new Error('Invalid token format');
//         }
//     } catch (error) {
//         console.error("Error verifying token:", error);
//         res.status(401).json({ message: "Not authorized, invalid token" });
//     }
// };



















import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { Vendor } from "../../../../infrastructure/database/dbmodel/vendorModel";
import { log } from "console";

declare module 'express-serve-static-core' {
    interface Request {
      vendor?: any;     
    }
}

export const protectVendor = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.header("Authorization");

    log(token, 'token8086'); 

    if (token && token.startsWith("Bearer ")) {
        token = token.split(' ')[1]; 
        log(token, 'tokenWithoutBearer'); 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: string, email: string, role: string };
            log(decoded, "decoded"); 

            req.vendor = decoded;
            const vendorId = req.vendor.user;
            log(vendorId, "usvendorIderId"); 

            const vendor = await Vendor.findById(vendorId);
            log('User found:', vendor); 

            if (!vendor) {
                log('User not found');
                res.status(401).json({ message: "User not found" });
                return;
            }

            // if (user.is_blocked) {
            //     log('User is blocked');
            //     res.status(401).json({ message: "User is blocked" });
            //     return;
            // }

            if(req.vendor.role = 'vendor'){
                next();
            }
        } catch (error) {
            log(error, 'JWT verification error'); // Log the error
            if (error instanceof jwt.TokenExpiredError) {
                res.status(401).json({ message: "Token expired" });
            } else {
                res.status(401).json({ message: "Not authorized, invalid token" });
            }
        }
    } else {
        log('No token provided');
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
