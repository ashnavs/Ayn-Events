import { NextFunction, Request, Response } from "express"
import vendorInteractor from "../../domain/usecases/auth/vendorInteractor";


export default{
    vendorRegister: async(req:Request , res:Response, next:NextFunction) => {
      
        try {

            const { name, email, city, vendorType, password } = req.body;
            console.log(req.body);
            

            
            const vendor =  await vendorInteractor.registerVendor(req.body);
            res.status(200).json({message:'Registration success' , vendor})
        } catch (error) {
            console.log(error);
            
        }
    },

    verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
        console.log('otp', req.body);
    
        try {
          const response = await vendorInteractor.verifyVendor(req.body);
          console.log("verifyOTP", response);
          res.status(200).json({ message: 'Verify Success', response })
        } catch (error: any) {
          console.error(error.message)
          res.status(500).json({ error: error.message })
          next(error)
        }
    
    
      },


      vendorLogin:async(req:Request , res:Response) => {
        console.log('logindata',req.body);

        try {

            const {email,password} = req.body;
            console.log(req.body);
            
            const response = await vendorInteractor.loginVendor(email,password);
            res.status(200).json({message:'Login success' , response})
        } catch (error:any) {
            console.error(error.message)
            res.status(500).json({error: error.message})
        }
        
      },
    
    

    }
