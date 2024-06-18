import { NextFunction, Request, Response } from "express"
import userInteractor from "../../domain/usecases/auth/userInteractor";
import { generateOTP } from '../../utils/otpUtils'
import sendOTPEmail from '../../utils/emailUtils'



export default {
  userRegistration: async (req: Request, res: Response, next: NextFunction) => {
    try {


      const user = await userInteractor.registerUser(req.body);

      console.log(user);
      res.status(200).json({ message: "registration success", user });

    } catch (error: any) {
      console.log(error);
      res.status(500).json(error);
    }
  },



  verifyOTP: async (req: Request, res: Response, next: NextFunction) => {
    console.log("boodddghyghsd", req.body);

    try {
      const response = await userInteractor.verifyUser(req.body);
      console.log("verifyOTP", response);
      res.status(200).json({ message: 'Verify Success', response })
    } catch (error: any) {
      console.error(error.message)
      res.status(500).json({ error: error.message })
      next(error)
    }


  },

  userLogin: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      console.log(req.body);
      const { email, password } = req.body

      const response = await userInteractor.loginUser(email, password);
      console.log(response);
      res.status(200).json({ message: 'Login success', response })
    } catch (error: any) {
      console.error("Controller error:", error.message);
    res.status(500).json({ message: error.message });
    // next(error);
    }
  },

  // userLogin: async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { email, password } = req.body;
  //     const response = await userInteractor.loginUser(email, password);
  //     console.log("response ",response);
      
  //     res.status(200).json({ message: 'Login success', response });
  //   } catch (error: any) {
  //     console.error("Controller error:", error.message);
  
  //     // Set status code based on error message
  //     let statusCode = 500;
  //     if (error.message === 'User not found' || error.message === 'Invalid password') {
  //       statusCode = 401; // Unauthorized
  //     } else if (error.message === 'Account is Blocked') {
  //       statusCode = 403; // Forbidden
  //     }
  //     console.log('error',error.message);
      
  //     res.status(statusCode).json({ message: error.message });

  //     // next(error);
  //   }
  // },

  googleAuth: async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    try {
      const response = await userInteractor.googleUser(req.body);
      res.status(200).json({ message: 'Google auth success', response })
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error)
    }



  }
}

declare module 'express-session' {
  interface SessionData {

    otp?: string;
    otpGeneratedAt?: number;
    email: string;
  }
}
