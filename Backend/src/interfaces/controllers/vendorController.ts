import { NextFunction, Request, response, Response } from "express"
import vendorInteractor from "../../domain/usecases/auth/vendorInteractor";
import { log } from "console";
import { uploadToS3 } from "../../utils/s3Uploader";
import { LicenseDataRequest } from "../../domain/entities/types/licenceType";
import { getServiceName, getVendorById } from "../../infrastructure/repositories/mongoAdminRepository";
import { updateVendor, vendorCount } from "../../infrastructure/repositories/mongoVendorrepository";
import { Service } from "../../infrastructure/database/dbmodel/serviceModel";
import { getPosts } from "../../infrastructure/repositories/mongoPostRepository";
import { Vendor } from "../../infrastructure/database/dbmodel/vendorModel";
import Post from "../../infrastructure/database/dbmodel/postModel";
import eventBookingModel from "../../infrastructure/database/dbmodel/eventBookingModel";
import { UpdateVendorData } from "../../domain/entities/types/vendorTypes";
import ChatModel from "../../infrastructure/database/dbmodel/chatModel";
import Message from "../../infrastructure/database/dbmodel/MessageModel";
import walletModel from "../../infrastructure/database/dbmodel/walletModel";
import { Users } from "../../infrastructure/database/dbmodel/userModel";
import mongoose, { ObjectId } from 'mongoose';


export default{
    vendorRegister: async(req:Request , res:Response, next:NextFunction) => {
      
        try {

            const { name, email, city, vendorType, password } = req.body;
            console.log(req.body,"vendorsign");
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
    licenseUpload: async (req: Request, res: Response) => {
      try {
        const { licenseNumber, email, issueDate, expiryDate } = req.body;
        
       
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
        const licenseDocument = files?.licenseDocument?.[0];
        const logo = files?.logo?.[0];
    
        if (!licenseDocument) {
          console.error('License document is missing.');
          return res.status(400).json({ message: 'License document is required' });
        }
    
        if (!logo) {
          console.error('Logo is missing.');
          return res.status(400).json({ message: 'Logo is required' });
        }
    
        const licenseData: LicenseDataRequest = { licenseNumber, email, issueDate, expiryDate, licenseDocument, logo };
        const result = await vendorInteractor.uploadVendorLicense(licenseData);
    
        res.status(200).json({ message: 'License and logo uploaded successfully',result });
      } catch (error: any) {
        console.error('Error in licenseUpload:', error);
        res.status(500).json({ message: 'Error uploading license and logo', error: error.message });
      }
    },
    checkAuth:async(req:Request, res:Response)=>{
      console.log("Hellooooo");
      
    },
    resendOtp:async(req:Request,res:Response) => {
      try {
        const {email} = req.body;
        const response = await vendorInteractor.resendOtp(email);
        res.status(200).json({response})
      } catch (error:any) {
        res.status(500).json(error)
      }
    },
    getVendorById:async (req: Request, res: Response) => {
      const vendorId = req.params.id;
    
      try {
        const vendor = await Vendor.findById(vendorId);
        console.log(vendor,"😯")
        
        if (!vendor) {
          return res.status(404).json({ message: 'Vendor not found' });
        }
    
        res.status(200).json(vendor);
      } catch (error) {
        console.error('Error fetching vendor:', error);
        res.status(500).json({ message: 'Server error' });
      }
    },
    getServices: async (req: Request, res: Response) => {
      console.log("Call received")
      try {
        const services = await Service.find().distinct('name');
        console.log(services, "😂");
        res.status(200).json(services);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch services' });
      }
    },
    createPost: async(req:Request , res:Response) => {
      log('post ')
      try {

        const { description,vendorId } = req.body;
        log(req.body,'post body')
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const image = files?.image?.[0];
  
        if (!description || !image) {
          return res.status(400).json({ error: 'Description and image are required' });
        }

      
        console.log(req.body,image,'posts');

        const postData = {vendorId,description,image};
        const savedPost = await vendorInteractor.createPost(postData);
    
        return res.status(200).json({messgae: 'post added successfully',post:savedPost})
        
      } catch (error:any) {
        res.status(500).json({ error: 'Failed to add post' });
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
    // getVendors : async (req: Request, res: Response): Promise<void> => {
    //   const { service, city } = req.query;
    
    //   try {
    //     const vendors = await vendorInteractor.fetchVendorsByCategoryAndCity(service as string, city as string);
    //     res.status(200).json(vendors);
    //   } catch (error) {
    //     res.status(500).json({ message: 'Error fetching vendors', error });
    //   }
    // }
    updateVendor: async (req: Request, res: Response) => {
      const { vendorId } = req.params;
      const { name, city, services } = req.body;
      console.log("reqbody", req.body);
    
      try {
    
        const updatedVendor = await updateVendor(vendorId, { name, city, services });
    
        if (updatedVendor) {
          res.status(200).json({ message: 'Vendor profile updated successfully', vendor: updatedVendor });
        } else {
          res.status(404).json({ message: 'Vendor not found' });
        }
      } catch (error: any) {
        res.status(500).json({ error: `Failed to update the vendor: ${error.message}` });
      }
    },
    deletePost: async(req:Request, res:Response) => {
      try {
        const {postId} = req.params
        const posts = await Post.findByIdAndDelete(postId)
        res.status(200).json(posts)
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
      }
    },
    bookingDetails: async (req: Request, res: Response) => {
      const { vendorId } = req.params;
      console.log(vendorId,"vendid")
      try {
        const bookings = await eventBookingModel.find({ vendor: vendorId })
          .populate('user')
          .populate('vendor')
          .sort({ _id: -1 });
        console.log(bookings, "bookings"); // This should output the bookings
        res.json(bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
    // updateBookingStatus:async(req:Request,res:Response) => {
    //   const { id } = req.params; // Extract booking ID from request parameters
    //   const { status } = req.body; 
    //   console.log("bookID:",id)
    //   console.log("status:",status)

    //   try {
    //     const booking = await eventBookingModel.findByIdAndUpdate(id, {status} , {new:true});
    //     if (!booking) {
    //       return res.status(404).json({ message: 'Booking not found' });
    //     }
    //     res.status(200).json(booking)
    //   } catch (error) {
    //     console.error('Error updating booking status:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    // },

    updateBookingStatus: async (req: Request, res: Response) => {
      const { id } = req.params; 
      const { status } = req.body; 
      console.log('id:',id)
      console.log('status:',status)
    
      try {
        
        const booking = await eventBookingModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
    
        
        if (status === 'Rejected') {
          const userId = booking.user;
          const amount = booking.amount;
    
        
          const wallet = await walletModel.findOne({ userId });
          if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
          }
    
         
          wallet.balance += amount;
   
          wallet.transactions.push({
            amount,
            type: 'credit',
            date: new Date(),
            booking: booking._id as mongoose.Types.ObjectId,
          });
    
         
          await wallet.save();
        }
    
        res.status(200).json(booking);
      } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },
    // getBookingDetails:async(req:Request , res:Response) => {
    //   const {bookingId} = req.params
    //   console.log(bookingId,"😒")
    //   try {
    //     const bookings = await eventBookingModel.findById(bookingId)
    //     console.log(bookings,"💕")
    //     if (!bookings) {
    //       return res.status(404).json({ message: 'Booking not found' });
    //     }
    //     res.status(200).json(bookings)
    //   } catch (error) {
    //     console.error('Error updating booking details:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    // }


    getBookingDetails:async (req: Request, res: Response) => {
      const { bookingId } = req.params;
      console.log(bookingId, "😒");
      try {
        const booking = await eventBookingModel.findById(bookingId)
          .populate({
            path: 'user', 
            select: 'name email' 
          })
          .exec();
    
        console.log(booking, "💕");
        if (!booking) {
          return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    // getBookingDetails: async (req: Request, res: Response) => {
    //   const { bookingId } = req.params;
    //   console.log(bookingId, "😒");
    
    //   try {
    //     const booking = await eventBookingModel.findById(bookingId)
    //       .populate({
    //         path: 'user',
    //         select: 'name email'
    //       })
    //       .sort({ _id: 1 }) // Sort by date in descending order (latest first)
    //       .exec();
    
    //     console.log(booking, "💕");
    
    //     if (!booking) {
    //       return res.status(404).json({ message: 'Booking not found' });
    //     }
    
    //     res.status(200).json(booking);
    //   } catch (error) {
    //     console.error('Error fetching booking details:', error);
    //     res.status(500).json({ message: 'Internal server error' });
    //   }
    // },
    
    // getVendorCount: async (req: Request, res: Response) => {
    //   try {
    //     const vendorCounts = await vendorCount();
    //     console.log('Vendor count retrieved:', vendorCounts); // Log the count
    //     res.json({ count: vendorCounts });
    //   } catch (error) {
    //     console.error('Failed to fetch vendor count:', error); // More specific error log
    //     res.status(500).json({ message: 'Failed to fetch vendor count' });
    //   }
    // },
    getVendorCount: async (req: Request, res: Response) => {
      console.log('hiii')
      try {
        const vendorCounts = await Vendor.countDocuments(); ;
        console.log('Vendor count retrieved:', vendorCounts); 
        res.json(vendorCounts );
      } catch (error) {
        console.error('Failed to fetch vendor count:', error); 
        res.status(500).json({ message: 'Failed to fetch vendor count' });
      }
    },
    getActiveChats : async (req: Request, res: Response) => {
      try {
        const { vendorId } = req.params;
        console.log(vendorId,'vendoriddididid')
    
     
        const activeChats = await ChatModel.find({
          users: vendorId,
          is_accepted: 'accepted'
        }).populate('users', 'name').populate('latestMessage');

        console.log(activeChats,'activeChats')
    
        res.status(200).json(activeChats);
      } catch (error) {
        console.error('Error fetching active chats:', error);
        res.status(500).json({ message: 'Server error' });
      }
    },
    getMessages:async(req:Request, res:Response) => {
      const { chatId } = req.params;
      console.log(chatId,'chatId')

  
  try {
    const messages = await Message.find({ chat: chatId })
                                  .populate('sender', 'name')
                                  .sort({ createdAt: 1 }); 
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
    }
    
    

    
}
