import { NextFunction, Request, Response } from "express"
import userInteractor from "../../domain/usecases/auth/userInteractor";
import { generateOTP } from '../../utils/otpUtils'
import sendOTPEmail from '../../utils/emailUtils'



export default {
  userRegistration: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userInteractor.registerUser(req.body);
      res.status(200).json({ message: "registration success", user });

    } catch (error: any) {
      console.log(error);
      if (error.message === 'User already exist') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  },



  verifyOTP: async (req: Request, res: Response) => {
    console.log("boodddghyghsd", req.body);

    try {
      const response = await userInteractor.verifyUser(req.body);
      console.log("verifyOTP", response);
      res.status(200).json({ message: 'Verify Success', response })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ error: error.message })
    
    }


  },

  userLogin: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      console.log(req.body);
      const { email, password } = req.body

      const response = await userInteractor.loginUser(email, password);
      console.log("response login",response);
      res.status(200).json({ message: 'Login success', response })
    } catch (error: any) {
      console.error("Controller error:", error.message);
      if(error.message === 'User is not verified'){
        res.status(403).json({ message: 'User is not verified' });
      }else
   { res.status(500).json({ message: error.message })}
    // next(error);
    }
  },



  googleAuth: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const response = await userInteractor.googleUser(req.body);
      res.status(200).json({ message: 'Google auth success', response })
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error)
    }



  },


  getStatus: async (req: Request, res: Response) => {

    try {
      const id = req.query.id as string
      console.log(id)
      const response = await userInteractor.getStatus(id);
      res.status(200).json({response})
    } catch (error: any) {
      
      console.log(error);
      res.status(500).json(error)
    }



  },
  resendOTP:async(req:Request, res:Response) => {
    try {

      const {email} = req.body
     
      const response = await userInteractor.otpResend(email)
      res.status(200).json({response})
    } catch (error) {
      res.status(500).json(error)
    }
  },
  checkAuth:async(req:Request, res:Response)=>{
    console.log("Hellooooo");
    
  }
}


