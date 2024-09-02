import { NextFunction, Request, Response } from "express"
import userInteractor from "../../domain/usecases/auth/userInteractor";
import { generateOTP } from '../../utils/otpUtils'
import sendOTPEmail from '../../utils/emailUtils'
import { getAllVendors } from "../../infrastructure/repositories/mongoVendorrepository";
import { getServices, getUserbyEMail, userCount } from "../../infrastructure/repositories/mongoUserRepository";
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
import { Encrypt } from "../../domain/helper/hashPassword";
import { getServiceImages } from "../../infrastructure/repositories/mongoServiceRepository";
import ChatModel from "../../infrastructure/database/dbmodel/chatModel";
import Message from "../../infrastructure/database/dbmodel/MessageModel";
import walletModel from "../../infrastructure/database/dbmodel/walletModel";
import { ConnectContactLens } from "aws-sdk";
import mongoose, { ObjectId } from 'mongoose';
import {isAfter , subWeeks} from 'date-fns'
import { Favorite } from "../../infrastructure/database/dbmodel/favoritesModel";
import { Service } from "../../infrastructure/database/dbmodel/serviceModel";





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
      console.log(bookingData,"bookdata")

      const newBooking = await userInteractor.addNewBooking(bookingData);
      console.log(newBooking,"newbook")
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


    // getVendors:async (req: Request, res: Response) => {
    //   try {
    //     const { service, city } = req.query as VendorQuery; // Cast query to VendorQuery
    //     console.log(`service: ${service} city: ${city}`); // Debug log
    
    //     const query: any = { is_verified: true, is_blocked: false }; // Use `any` type here for dynamic properties
    //     if (service) query.service = service;
    //     if (city) query.city = city;
    
    //     try {
    //       let vendors;
    //       if (!service && !city) {
    //         // Fetch all vendors if no query parameters are provided
    //         vendors = await getVendorsWithService();
    //         log(vendors,"vvvvvv")
    //       } else {
    //         // Fetch vendors based on query parameters
    //         vendors = await Vendor.find(query, {
    //           _id: 1, name: 1, email: 1, city: 1, service: 1, is_blocked: 1
    //         });
    //       }
    //       res.status(200).json(vendors);
    //       console.log(vendors, "vendors"); // Debug log
    //     } catch (error) {
    //       console.error('Failed to fetch vendors', error);
    //       res.status(500).json({ message: 'Failed to fetch vendors' });
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch vendors', error);
    //     res.status(500).json({ message: 'Failed to fetch vendors' });
    //   }
    // },

  //   getVendors : async (req: Request, res: Response) => {
  //     try {
  //         const { service, city } = req.query as { service?: string; city?: string }; 
  //         console.log(`service: ${service} city: ${city}`);
  
  //         const query: any = { is_verified: true, is_blocked: false };
  //         if (service) {
  //             query.services = { $elemMatch: { name: service } };
  //         }
  //         if (city) {
  //             query.city = city;
  //         }
  
  //         try {
  //             let vendors;
  //             if (!service && !city) {
  //                 // Fetch all vendors if no query parameters are provided
  //                 const result = await getVendorsWithService();
  //                 vendors = result.vendors;
  //                 console.log(vendors, "All vendors with services");
  //             } else {
  //                 // Fetch vendors based on query parameters
  //                 vendors = await Vendor.find(query, {
  //                     _id: 1, name: 1, email: 1, city: 1, services: 1, is_blocked: 1
  //                 }).lean(); 
  //                 console.log(vendors, "Filtered vendors");
  //             }
  //             res.status(200).json(vendors);
  //         } catch (error) {
  //             console.error('Failed to fetch vendors', error);
  //             res.status(500).json({ message: 'Failed to fetch vendors' });
  //         }
  //     } catch (error) {
  //         console.error('Failed to fetch vendors', error);
  //         res.status(500).json({ message: 'Failed to fetch vendors' });
  //     }
  // },  

  //new:
  getVendors:async (req: Request, res: Response) => {
    try {
      const { service, city } = req.query as { service?: string; city?: string };
  
      console.log(`service: ${service} city: ${city}`);
  
      const query: any = { is_verified: true, is_blocked: false };
      if (service) {
        query.services = { $elemMatch: { name: service } };
      }
      if (city) {
        query.city = city;
      }
  
      let vendors;
      if (!service && !city) {
        
        const result = await getVendorsWithService();
        vendors = result.vendors;
        console.log(vendors, "All vendors with services");
      } else {
        
        vendors = await Vendor.find(query, {
          _id: 1, name: 1, email: 1, city: 1, services: 1, is_blocked: 1
        }).lean();
        console.log(vendors, "Filtered vendors");
      }
  
    
      const serviceNames = [...new Set(vendors.flatMap(vendor => vendor.services.map(service => service.name)))];
  
    
      const serviceImages = await getServiceImages(serviceNames);
      const serviceImagesMap = new Map(serviceImages.map(img => [img.name, img.imageUrl]));
  
      const vendorsWithImages = vendors.map(vendor => ({
        ...vendor,
        services: vendor.services.map(service => ({
          ...service,
          imageUrl: serviceImagesMap.get(service.name) || '' 
        }))
      }));
  
      res.status(200).json(vendorsWithImages);
    } catch (error) {
      console.error('Failed to fetch vendors', error);
      res.status(500).json({ message: 'Failed to fetch vendors' });
    }
  },
    updateUser:async(req:Request , res:Response) => {
      const {name} = req.body
        const {userId} = req.params
      try {
        
        const user = await Users.findById(userId)

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        user.name = name || user.name;


        const updatedUser =  await user.save();
        console.log(updatedUser,'upuser')
        res.status(200).json(  updatedUser );
        
      } catch (error) {
        console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
      }
    },
    bookingDetails: async (req: Request, res: Response) => {
      const { userId } = req.params;
      console.log(userId,"userIddddddddd")
      try {
        const bookings = await eventBookingModel.find({ user: userId })
          .populate('user')
          .populate('vendor')
          .sort({_id: -1});
        console.log(bookings, "bookings");
        res.json(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
    //   updateBookingStatus:async(req:Request,res:Response) => {
    //   const { bookingId } = req.params; // Extract booking ID from request parameters
    //   const { status } = req.body; 
    //   console.log("bookID:",bookingId)
    //   console.log("status:",status)

    //   try {
    //     const booking = await eventBookingModel.findByIdAndUpdate(bookingId, {status} , {new:true});
    //     if (!booking) {
    //       return res.status(404).json({ message: 'Booking not found' });
    //     }
    //     res.status(200).json(booking)
    //   } catch (error) {
    //     console.error('Error updating booking status:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    // },

// updateBookingStatus : async (req: Request, res: Response) => {
//   const { bookingId } = req.params; // Extract booking ID from request parameters
//   const { status } = req.body;

//   console.log("bookID:", bookingId);
//   console.log("status:", status);

//   try {
//     // Find and update the booking status
//     const booking = await eventBookingModel.findByIdAndUpdate(bookingId, { status }, { new: true });
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Ensure the user ID is retrieved correctly
//     const userId = booking.user.toString();
//     console.log("userID:", userId);

//     // If the booking is canceled, credit the amount back to the user's wallet
//     if (status === 'Cancelled') {
//       const wallet = await walletModel.findOne({ userId });

//       if (!wallet) {
//         console.log("Wallet not found, creating new wallet...");

//         // Create a new wallet if it doesn't exist
//         const newWallet = new walletModel({
//           userId,
//           balance: booking.payment.amount,
//           transactions: [{
//             amount: booking.payment.amount,
//             type: 'credit',
//             date: new Date(),
//           }],
//         });

//         const savedWallet = await newWallet.save();
//         console.log("New wallet created:", savedWallet);

//       } else {
//         console.log("Wallet found, updating balance...");

//         // Add the amount to the existing wallet
//         wallet.balance += booking.payment.amount;
//         wallet.transactions.push({
//           amount: booking.payment.amount,
//           type: 'credit',
//           date: new Date(),
//         });

//         const updatedWallet = await wallet.save();
//         console.log("Wallet updated:", updatedWallet);
//       }
//     }

//     res.status(200).json(booking);
//   } catch (error) {
//     console.error('Error updating booking status:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// },

updateBookingStatus:async (req: Request, res: Response) => {
  const { bookingId } = req.params; // Extract booking ID from request parameters
  const { status } = req.body;

  try {

    const booking = await eventBookingModel.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

  
    booking.status = status;
    await booking.save();

   
    if (status === 'Cancelled') {
      const userId = booking.user.toString(); 
      const amount = booking.payment.amount;
      const eventDate = new Date(booking.date);
      const currentDate = new Date();
   
      let refundAmount = 0;
      const weeksBeforeEvent = (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7);

      if (weeksBeforeEvent >= 2 && weeksBeforeEvent < 3) {
        refundAmount = amount * 0.30; 
      } else if (weeksBeforeEvent >= 3) {
        refundAmount = amount * 0.50; 
      }

      if (refundAmount > 0) {
       
        let wallet = await walletModel.findOne({ userId });

        if (!wallet) {
          wallet = new walletModel({
            userId,
            balance: refundAmount,
            transactions: [{
              amount: refundAmount,
              type: 'credit',
              date: new Date(),
              booking: booking._id as mongoose.Types.ObjectId,  
            }],
          });

          await wallet.save();

          console.log('wall',wallet)
        } else {
          wallet.balance += refundAmount;
          wallet.transactions.push({
            amount: refundAmount,
            type: 'credit',
            date: new Date(),
            booking: booking._id as mongoose.Types.ObjectId,  
          });

          await wallet.save();
        }
      }
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
},

    changePassword:async(req:Request,res:Response) => {
      const {currentPassword,newPassword,userId} = req.body
      console.log(currentPassword,newPassword,userId)
      try {
        const user = await Users.findById(userId);

        if(!user){
          return res.status(404).json({ message: 'User not found' });
        }

        if (!user.password) {
          return res.status(400).json({ message: 'User password not set' });
        }

        const isMatch = await Encrypt.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await Encrypt.cryptPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        
      }
    },
    getUserCount: async (req: Request, res: Response) => {
      try {
   
  
        const userCounts = await userCount()
        res.json(userCounts);
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        res.status(500).json({ message: 'Failed to fetch bookings' })
      }
    },
    chatRoomExist:async(req:Request,res:Response) => {
      const {userId} = req.body
      console.log(userId)
    },
    getActiveChats : async (req: Request, res: Response) => {
      const userId = req.params.userId;

  try {
    const chats = await ChatModel.find({
      users: userId,
      is_accepted: 'accepted'
    })
      .populate({
        path: 'users',
        model: 'User',
        select: 'name',
        match: { _id: { $ne: userId } }
      })
      .populate({
        path: 'users',
        model: 'Vendor',
        select: 'name'
      })
      .exec();

    res.json(chats);
  } catch (error) {
    console.error('Error fetching active chats:', error);
    if (!res.headersSent) {
      res.status(500).send('Server error');
    }
  }},
    getMessagesByRoomId : async (req: Request, res: Response) => {
      const roomId = req.params.roomId;
      console.log(roomId,'rmid')
    
      try {
      
        const chat = await ChatModel.findById(roomId)
          .populate('users', 'name')  
          .populate({
            path: 'users',
            match: { _id: { $ne: req.params.userId } }, 
            select: 'name'
          })
          .exec();
    
        if (!chat) {
          return res.status(404).json({ message: 'Chat not found' });
        }
    
    
        const messages = await Message.find({ chat: roomId })
          .populate('sender', 'name')  
          .exec();
    
        
        const vendors = await Vendor.find({ _id: { $in: chat.users } });
    
       
        res.json({
          chat,
          messages,
          vendors
        });
      } catch (error) {
        console.error('Error fetching chat and messages:', error);
        if (!res.headersSent) {
          res.status(500).send('Server error');
        }
      }
    },
    // getWallets:async(req:Request,res:Response) => {
    //   try {
    //     // Extract userId from req.params
    //     const { userId } = req.params;
    //     console.log(userId, "Received userId");
    
    //     const walletData = await walletModel.findOne({ userId }); // Adjust as per your schema

    //     if (!walletData) {
    //       return res.status(404).json({ message: 'Wallet not found' });
    //     }
    
    //     // Send the wallet data as response
    //     res.json(walletData);
    //   } catch (error) {
    //     console.error('Error fetching wallet data:', error);
    //     res.status(500).json({ message: 'Internal Server Error' });
    //   }
    // }

     getWallets : async (req: Request, res: Response) => {
      try {
        const { userId } = req.params;
        console.log(userId, "Received userId");
    
        const walletData = await walletModel.findOne({ userId })
          .populate({
            path: 'transactions.booking',
            model: 'Booking',
            select: 'event_name vendor_name'
          });

          console.log('walletData:',walletData)
    
        if (!walletData) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
    
        res.json(walletData);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    },
    getAllBookings:async(req:Request,res:Response) => {
      try {
        const booking = await eventBookingModel.find()
        res.status(200).json(booking)
      } catch (error) {
        console.error('Error fetching bookings:' , error)
        res.status(500).json({message:'Internal serevr error'})
      }
    },
    getAllServices:async(req:Request , res:Response) => {
      try {
        const services = await Service.find({is_active:true});
        res.status(200).json(services)
      } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
    

   


    

}


