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
import { saveBooking } from "../../infrastructure/repositories/mongoBookingRepository";
import eventBookingModel from "../../infrastructure/database/dbmodel/eventBookingModel";
import { VendorQuery } from "../../domain/entities/types/vendorTypes";
import { getVendorsWithService } from "../../infrastructure/repositories/mongoVendorrepository";





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
      const { email, password } = req.body;
      const response = await userInteractor.loginUser(email, password);
      const { token, refreshToken } = response;
      res.cookie('usertoken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.status(200).json({ message: 'Login success', response });
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
      const response = await userInteractor.getStatus(id);
      res.status(200).json({ response })
    } catch (error: any) {

      console.log(error);
      res.status(500).json(error)
    }



  },
  resendOTP: async (req: Request, res: Response) => {
    try {

      const { email } = req.body

      const response = await userInteractor.otpResend(email)
      res.status(200).json({ response })
    } catch (error) {
      res.status(500).json(error)
    }
  },
  checkAuth: async (req: Request, res: Response) => {
    console.log("Hellooooo");

  },
  getVendor: async (req: Request, res: Response) => {
    try {
      const response = await getAllVendors()
      res.status(200).json({ response })

    } catch (error) {
      res.status(500).json(error)

    }
  },
  getServiceUser: async (req: Request, res: Response) => {
    const categoryName = req.params.name;
    try {
      const response = await getServices()
      console.log(response,"imgurl")
      res.status(200).json({ response })

    } catch (error) {
      res.status(500).json(error)
    }
  },

  refreshToken: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;


      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not provided" });
      }

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY!) as { user: string, email: string, role: string };
      const user = await getUserbyEMail(decoded.email)
      const { token: newAccessToken, refreshToken: newRefreshToken } = generateToken(user?.id, decoded.email, 'user');
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  getLicenseByVendorEmail: async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
      const license = await LicenseModel.findOne({ email }).exec();
      if (!license) {
        return res.status(404).json({ message: 'License not found' });
      }

      res.status(200).json(license);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching license', error: error.message });
    }
  },
  getVendorDetails: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findById(id);
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      res.status(200).json(vendor);
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      res.status(500).json({ message: 'Error fetching vendor', error: error.message });
    }
  },
  reportVendor: async (req: Request, res: Response) => {
    try {
      const { vendorId, reason } = req.body
      console.log(vendorId,reason,"viddd")
      await userInteractor.reportVendor(vendorId, reason)
      return res.status(200).json({ message: 'Report submitted successfully' });

    } catch (error: any) {
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
  createReview: async (req: Request, res: Response) => {
    try {
      const { vendorId, userId, review, rating } = req.body
      const reviewData = { vendorId, userId, review, rating }
      const reviews = await userInteractor.createReview(reviewData)
      return res.status(200).json(reviews)
    } catch (error) {
      console.error('Error creating review and rating:', error);
      res.status(500).json({ message: 'Failed to submit review and rating' });
    }
  },
  getReviews: async (req: Request, res: Response) => {
    try {
      const { vendorId } = req.query as { vendorId: string };
      const reviews = await getReviewsAndRatings(vendorId)
      res.status(200).json(reviews)
    } catch (error) {

    }
  },
  bookEvents: async (req: Request, res: Response) => {
    try {

      const bookingData = req.body;

      const newBooking = await userInteractor.addNewBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  checkAvailability: async (req: Request, res: Response) => {
    try {
      const { date, vendorId } = req.body;

      const available = await userInteractor.checkBookingAvailability(date, vendorId);


      res.status(200).json({ available });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
  getBookings: async (req: Request, res: Response) => {
    try {
      const { userId, vendorId } = req.query;

      const bookings = await eventBookingModel.find({ user: userId, vendor: vendorId });
      res.json(bookings);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      res.status(500).json({ message: 'Failed to fetch bookings' })
    }
  },
    // getVendors:async(req:Request,res:Response) => {
    //   try {
    //     const {service,city} = req.query
    //     log(`service:${service} city:${city}`)

    //     try {
    //       const vendors = await Vendor.find({
    //         service:service,
    //         city:city
    //       })
    //       res.status(200).json(vendors)
    //       log(vendors,"filtervendors")
    //     } catch (error) {
          
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch vendors', error);
    //     res.status(500).json({ message: 'Failed to fetch vendors' })
    //   }
    // }


    getVendors:async (req: Request, res: Response) => {
      try {
        const { service, city } = req.query as VendorQuery; // Cast query to VendorQuery
        console.log(`service: ${service} city: ${city}`); // Debug log
    
        const query: any = { is_verified: true, is_blocked: false }; // Use `any` type here for dynamic properties
        if (service) query.service = service;
        if (city) query.city = city;
    
        try {
          let vendors;
          if (!service && !city) {
            // Fetch all vendors if no query parameters are provided
            vendors = await getVendorsWithService();
            log(vendors,"vvvvvv")
          } else {
            // Fetch vendors based on query parameters
            vendors = await Vendor.find(query, {
              _id: 1, name: 1, email: 1, city: 1, service: 1, is_blocked: 1
            });
          }
          res.status(200).json(vendors);
          console.log(vendors, "vendors"); // Debug log
        } catch (error) {
          console.error('Failed to fetch vendors', error);
          res.status(500).json({ message: 'Failed to fetch vendors' });
        }
      } catch (error) {
        console.error('Failed to fetch vendors', error);
        res.status(500).json({ message: 'Failed to fetch vendors' });
      }
    }

    

}


