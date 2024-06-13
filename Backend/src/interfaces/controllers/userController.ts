import { NextFunction, Request, Response } from "express"
import userInteractor from "../../domain/usecases/auth/userInteractor";
import { generateOTP } from '../../utils/otpUtils'
import sendOTPEmail  from '../../utils/emailUtils'



export default {
  userRegistration: async(req:Request, res:Response, next:NextFunction) => {
    try {
      // const { name, email, password } = req.body;
      // console.log(req.body);
      
      const user = await userInteractor.registerUser(req.body);
      // if(user){
      //   if (!user.email || !user.name) {
      //     throw new Error("email not there")
      //   }
       
      //   // const otp = generateOTP();
        
      //   // const SessionData = req.session
      //   // req.session.otp = otp;
      //   // console.log("req.session.otp",req.session.otp);
      //   // req.session.otpGeneratedAt = Date.now();
      //   // console.log("Session DATA",req.session);
        
      //   // sendOTPEmail(user.email,otp,req,user.name);
      // }
      console.log(user);
      res.status(200).json({message :"registration success" , user});

    } catch (error:any) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  verifyOTP: async(req:Request, res:Response, next:NextFunction) => {
      console.log("boodddghyghsd",req.body);
      
    try {      
      const response = await userInteractor.verifyUser(req.body);
      console.log("verifyOTP",response);
      res.status(200).json({message: 'Verify Success' , response})      
    } catch (error:any) {
      console.error(error.message)
      res.status(500).json({error: error.message})
      next(error)
    }

        
  },

  userLogin: async(req:Request, res:Response, next:NextFunction) => {
    console.log(req.body);
    try {
      console.log(req.body);
      const { email,password } = req.body

      const response = await userInteractor.loginUser(email,password);
      console.log(response);
      res.status(200).json({message: 'Login success',response})
      
      
    } catch (error:any) {
        console.error(error.message)
        res.status(500).json({error: error.message})
        next(error)
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
