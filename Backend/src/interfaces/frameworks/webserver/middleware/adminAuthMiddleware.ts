// // adminAuthMiddleware.ts
// import { NextFunction, Response, Request } from "express";
// import jwt from 'jsonwebtoken';
// import { Admin, Iadmin } from "../../../../infrastructure/database/dbmodel/adminModel";

// // Extend the express Request interface to include admin property
// declare module 'express-serve-static-core' {
//     interface Request {
//         admin?: Iadmin;
//     }
// }

// export const protectAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const token = req.header("Authorization");

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
//             const adminId = decoded.user;
//             console.log(adminId, "✅");

//             const admin: Iadmin | null = await Admin.findById(adminId);
//             if (!admin) {
//                 res.status(401).json({ message: "Admin not found" });
//                 return;
//             }

//             req.admin = admin;
//             if(decoded.role = 'admin'){
//                 next();
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
import { Admin } from "../../../../infrastructure/database/dbmodel/adminModel";
import { log } from "console";

declare module 'express-serve-static-core' {
    interface Request {
      admin?: any;     
    }
}

export const protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.header("Authorization");

    log(token, 'tokenadmin'); 

    if (token && token.startsWith("Bearer ")) {
        token = token.split(' ')[1]; 
        log(token, 'tokenWithoutBearer'); 

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { user: string, email: string, role: string };

            req.admin = decoded;
            const adminId = req.admin.user;

            const admin = await Admin.findById(adminId);
            log('admin found:', admin); 

            if (!admin) {
                log('admin not found');
                res.status(401).json({ message: "admin not found" });
                return;
            }

            // if (user.is_blocked) {
            //     log('User is blocked');
            //     res.status(401).json({ message: "User is blocked" });
            //     return;
            // }

            if(req.admin.role = 'admin'){
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

