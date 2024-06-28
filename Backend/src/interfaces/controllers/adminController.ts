import { NextFunction , Request , Response } from "express";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";



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
           console.log(credentials);
           
            const response = await adminInteractor.loginAdmin(credentials);
            console.log(response);
            res.status(200).json({ message: 'Login success', response })

            

        } catch (error:any) {
            console.error(error.message)
            res.status(500).json({ error: error.message })
            next(error)            
        }
    },

        getUsers: async (req: Request, res: Response): Promise<void> => {
        try {
          const { page = 1, limit = 10 } = req.query;
          const users = await adminInteractor.getUsers(Number(page), Number(limit));
          res.status(200).json(users);
        } catch (error: any) {
          console.error(error.message);
          res.status(500).json({ error: error.message });
        }
      },
      
      blockUser: async (req: Request, res: Response): Promise<void> => {
        try {
          const { userId } = req.params;
          const { is_blocked } = req.body;
          const updatedUser = await adminInteractor.updatedUserStatus(userId, is_blocked);
          res.status(200).json(updatedUser);
        } catch (error: any) {
          console.error(error.message);
          res.status(500).json({ error: error.message });
       
        }
    }

  



}