import { NextFunction, Request, response, Response } from "express"
import vendorInteractor from "../../domain/usecases/auth/vendorInteractor";
import { log } from "console";
import { uploadToS3 } from "../../utils/s3Uploader";
import { LicenseDataRequest } from "../../domain/entities/types/licenceType";
import { getServiceName, getVendorById } from "../../infrastructure/repositories/mongoAdminRepository";
import { updateVendor } from "../../infrastructure/repositories/mongoVendorrepository";
import { Service } from "../../infrastructure/database/dbmodel/serviceModel";
import { getPosts } from "../../infrastructure/repositories/mongoPostRepository";
import { Vendor } from "../../infrastructure/database/dbmodel/vendorModel";

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
        await vendorInteractor.createPost(postData);
    
        return res.status(200).json({messgae: 'post added successfully'})
        
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
      const { name, city, service } = req.body;
    
      try {
        // Pass the service data as an array of strings
        const updatedVendor = await updateVendor(vendorId, { name, city, service });
        if (updatedVendor) {
          res.status(200).json({ message: 'Vendor profile updated successfully', vendor: updatedVendor });
        } else {
          res.status(404).json({ message: 'Vendor not found' });
        }
      } catch (error: any) {
        res.status(500).json({ error: `Failed to update the vendor: ${error.message}` });
      }
    }
    
}
