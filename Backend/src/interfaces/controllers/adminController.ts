import { NextFunction , Request , Response } from "express";
import { findAdmin } from "../../infrastructure/repositories/mongoAdminRepository";
import { NullExpression } from "mongoose";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";
import { log } from "console";


export default {
    adminLogin: async(req:Request, res:Response , next:NextFunction) => {
        try {
            console.log(req.body);
            const { email,password} = req.body
            if (!email && !password) {
               throw new Error("user credentials not there")
            }
           const credentials = {
             email , password
           }

            const response = await adminInteractor.loginAdmin(credentials);
            console.log(response);
            res.status(200).json({ message: 'Login success', response })

            

        } catch (error:any) {
            console.error(error.message)
            res.status(500).json({ error: error.message })
            next(error)            
        }
    },

    getUsers: async (req: Request, res: Response, next: NextFunction) => {
        try {
          const users = await adminInteractor.userList();
          res.status(200).json(users);
        } catch (error: any) {
          console.error(error.message);
          res.status(500).json({ error: error.message });
          next(error);
        }
    },

    blockUser: async(req:Request , res:Response, next:NextFunction) => {
        try {
           const { userId , is_blocked } = req.body;
           const updatedUser = await adminInteractor.updatedUserStatus(userId,is_blocked);
           console.log(updatedUser);
           
           res.status(200).json(updatedUser)
        } catch (error:any) {
            console.error(error.message);
            res.status(500).json({ error: error})
            next(error)
        }
    },

    // usersCount: async(req:Request, res:Response, next:NextFunction) => {

    // }



}