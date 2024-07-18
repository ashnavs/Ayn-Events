import { NextFunction, Request, Response } from "express"
import userInteractor from "../../domain/usecases/auth/userInteractor";
import { generateOTP } from '../../utils/otpUtils'
import sendOTPEmail from '../../utils/emailUtils'
import { getAllVendors } from "../../infrastructure/repositories/mongoVendorrepository";
import { getServices, getUserbyEMail } from "../../infrastructure/repositories/mongoUserRepository";
import { log } from "console";
import jwt from 'jsonwebtoken'
import { generateToken } from "../../domain/helper/jwtHelper";
import { LicenseModel } from "../../infrastructure/database/dbmodel/licenceModel";
import { Users } from "../../infrastructure/database/dbmodel/userModel";
import { Vendor } from "../../infrastructure/database/dbmodel/vendorModel";
import { getPosts } from "../../infrastructure/repositories/mongoPostRepository";
import { getReviewsAndRatings } from "../../infrastructure/repositories/mongoReviewRepository";





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

  // userLogin: async (req: Request, res: Response) => {
  //   console.log(req.body);
  //   try {
  //     console.log(req.body);
  //     const { email, password } = req.body

  //     const response = await userInteractor.loginUser(email, password);
  //     log(response,"😊")
  //     const refreshToken = response.refreshToken;
  //     log(refreshToken)
  //     // res.cookie('refreshToken',refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });    
  //       console.log("response login",response);
  //     res.status(200).json({ message: 'Login success', response })
  //   } catch (error: any) {
  //     console.error("Controller error:", error.message);
  //     if(error.message === 'User is not verified'){
  //       res.status(403).json({ message: 'User is not verified' });
  //     }else
  //  { res.status(500).json({ message: error.message })}
  //   // next(error);
  //   }
  // },

  userLogin : async (req: Request, res: Response) => {
    console.log(req.body);
  
    try {
      const { email, password } = req.body;
      console.log("Login request body:", req.body);
  
      // Call the interactor to perform login logic
      const response = await userInteractor.loginUser(email, password);
      log("Login response:", response);
  
      // Extract tokens from the response
      const { token, refreshToken } = response;
      log("Generated tokens:", { token, refreshToken });
  
      // Set the tokens as cookies
      res.cookie('usertoken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  
      console.log("Login success:", response);
  
      // Send success response with token data
      res.status(200).json({ message: 'Login success',  response });
    } catch (error: any) {
      console.error("Controller error:", error.message);
  
      if (error.message === 'User is not verified') {
        res.status(403).json({ message: 'User is not verified' });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  },


  googleAuth: async (req: Request, res: Response) => {
    console.log(req.body);
    try {
      const response = await userInteractor.googleUser(req.body);
      console.log("Google Auth Response:", response);
      res.status(200).json({ message: 'Google auth success', response })
    } catch (error: any) {
      console.log(error);
      res.status(500).json(error)
    }



  },


  getStatus: async (req: Request, res: Response) => {

    try {
      log("call 1")
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
    
  },
  getVendor:async(req:Request,res:Response) => {
   try {
     const response = await getAllVendors()
     console.log(response,"getvendorsverifi");
     
     res.status(200).json({response})
 
   } catch (error) {
    res.status(500).json(error)

   }
  },
  getServiceUser:async(req:Request,res:Response) => {
    log(req.user,'requser service')
    try {
      const response = await getServices()
      console.log(response,"👌");
      
      res.status(200).json({response})

    } catch (error) {
      res.status(500).json(error)
    }
  },
  // refreshToken:async(req:Request,res:Response) => {
  //   try {
  //     console.log('blah blahhhhhhhhhhhhhhhhhhhhhhhh');
      
  //     const refreshToken = req.cookies.refreshToken;
  //     log(req.cookies)  
  //     if(!refreshToken){
  //       return res.status(401).json({message:"Refresh token not provided"})
  //     }
  //     const decoded = jwt.verify(refreshToken,process.env.REFRESH_SECRET_KEY!) as { userId: string, email: string , role: string };
  //     const { token: newAccessToken, refreshToken:newRefreshToken} = generateToken(decoded.userId, decoded.email, 'user' );
  //     res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
  //     res.json({ accessToken: newAccessToken })
  //   } catch (error) {
  //     res.status(500).json({ error: (error as Error).message });
  //   }
  // },

  refreshToken : async (req: Request, res: Response) => {
    try {
        console.log('blah blahhhhhhhhhhhhhhhhhhhhhhhh');

        const refreshToken = req.cookies.refreshToken;
        log(req.cookies);

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token not provided" });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as { user: string, email: string, role: string };
        log("decoded",decoded)
        const user = await getUserbyEMail(decoded.email)
        const { token: newAccessToken, refreshToken: newRefreshToken } = generateToken(user?.id, decoded.email, 'user');
        log("decoded details",decoded.user, decoded.email, 'user')
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
},
  getLicenseByVendorEmail : async (req: Request, res: Response) => {
    log("🤷‍♀️licence")
    const { email } = req.params;
    log(email)
  

    try {
      const license = await LicenseModel.findOne({ email }).exec();
      if (!license) {
        return res.status(404).json({ message: 'License not found' });
      }
  
      res.status(200).json(license);
    } catch (error:any) {
      res.status(500).json({ message: 'Error fetching license', error: error.message });
    }
  },
  getVendorDetails: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log('Fetching vendor details for ID:', id); 
      const vendor = await Vendor.findById(id);
      console.log('Fetched vendor:', vendor); 
  
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }
  
      res.status(200).json(vendor);
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      res.status(500).json({ message: 'Error fetching vendor', error: error.message });
    }
  },
  reportVendor: async(req:Request, res:Response) => {
    try {
      const {vendorId,reason} = req.body
      log(req.body)

      await userInteractor.reportVendor(vendorId,reason)
      return res.status(200).json({ message: 'Report submitted successfully' });
    
    } catch (error:any) {
      console.error('Error fetching report:', error);
      res.status(500).json({ message: 'Error fetching report', error: error.message });
    }
  },
  getPosts: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.params;
      const posts = await getPosts(vendorId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get post' });
    }
  },
  createReview: async(req:Request,res:Response) => {
    try {
      const {vendorId,userId,review,rating} = req.body
      log(req.body,"vvid")
      const reviewData ={vendorId,userId,review,rating}
      const reviews = await userInteractor.createReview(reviewData)
      return res.status(200).json(reviews)
    } catch (error) {
      console.error('Error creating review and rating:', error);
      res.status(500).json({ message: 'Failed to submit review and rating' });
    }
  },
  getReviews:async(req:Request,res:Response) => {
    try {
      const {vendorId} = req.query as { vendorId: string };
      log(vendorId,'vvidreviewlist')
      const reviews = await getReviewsAndRatings(vendorId) 
      console.log(reviews,'getrevies');
      res.status(200).json(reviews)
      } catch (error) {
      
    }
  }
}


