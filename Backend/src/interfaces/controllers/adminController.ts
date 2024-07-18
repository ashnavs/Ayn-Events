import { NextFunction, Request, Response } from "express";
import adminInteractor from "../../domain/usecases/auth/adminInteractor";
import { Vendor } from "../../infrastructure/database/dbmodel/vendorModel";
import multer from "multer";
import { License, LicenseModel } from "../../infrastructure/database/dbmodel/licenceModel";
import { log } from "console";
import { getAllVendors } from "../../infrastructure/repositories/mongoVendorrepository";
import { getServices } from "../../infrastructure/repositories/mongoAdminRepository";
import { countReportsByVendor } from "../../infrastructure/repositories/mongoReportRepository";
import Report from "../../infrastructure/database/dbmodel/reportModel";



export default {
  adminLogin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const { email, password } = req.body
      if (!email && !password) {
        throw new Error("user credentials not there")
      }
      const credentials = {
        email, password
      }
      console.log(credentials);

      const response = await adminInteractor.loginAdmin(credentials);
      console.log(response);
      res.status(200).json({ message: 'Login success', response })



    } catch (error: any) {
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
      console.log('Request Params:', req.params);
      console.log('Request Body:', req.body);
      
      const updatedUser = await adminInteractor.updatedUserStatus(userId, is_blocked);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  
  },
  getVendors: async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      const vendors = await adminInteractor.getVendors(Number(page), Number(limit));
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: 'Failed to fetch vendors' });
    }
  },
  //   getUnverifiedVendors : async (req: Request, res: Response, next: NextFunction) => {
  //     try {
  //         const { page = 1, limit = 10 } = req.query;
  //         const vendors = await adminInteractor.fetchUnverifiedVendors(Number(page), Number(limit));
  //         res.status(200).json(vendors);
  //     } catch (error: any) {
  //         console.error(error.message);
  //         res.status(500).json({ error: error.message });
  //         next(error);
  //     }
  // },

  getVendorById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vendor = await adminInteractor.fetchVendorById(req.params.id);
      if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
      res.status(200).json(vendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },

  updateVendorVerificationStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { is_verified } = req.body;
      const vendor = await adminInteractor.verifyVendor(req.params.id, is_verified);
      if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
      res.status(200).json(vendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
      next(error);
    }
  },
  
  updateIsVerified: async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const { is_verified } = req.body;

    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(vendorId, { is_verified }, { new: true });
      res.json(updatedVendor);
    } catch (err) {
      console.error('Error updating vendor is_verified:', err);
      res.status(500).json({ error: 'Failed to update vendor is_verified' });
    }
  },
 getLicenseByVendorEmail : async (req: Request, res: Response) => {
    const { email } = req.params;
  
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
  getVerifiedVendors:async(req:Request,res:Response) => {
    try {
      const response = await getAllVendors()
      log(response)
      res.status(200).json(response)
    } catch (error:any) {
      res.status(500).json(error);
    }
  },
  blockVendor: async (req: Request, res: Response): Promise<void> => {
    try {
      const { vendorId } = req.params;
      const { is_blocked } = req.body;
      const updatedVendor = await adminInteractor.updatedVendorStatus(vendorId, is_blocked);
      log('protectaDMIN CALLED')
      log(updatedVendor,'upppppp')
      res.status(200).json(updatedVendor);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });

    }
  },
  addService: async (req: Request, res: Response) => {
    try {
      console.log('🤦‍♀️');
      
      const { name } = req.body;
      const image = req.file; 

      if (!image) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      const serviceData = { name, image };
      await adminInteractor.addService(serviceData);

      return res.status(200).json({ message: 'Service added successfully' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Failed to add service' });
    }
  },
  getServices: async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 5 } = req.query; // Adjusted limit to match frontend
      const services = await getServices(Number(page), Number(limit));
      res.status(200).json(services);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  },
  blockService: async (req: Request, res: Response): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const {is_active } = req.body;
      const updatedService = await adminInteractor.updatedServiceStatus(serviceId, is_active)
      
      res.status(200).json(updatedService);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: error.message });

    }
  },
  getReportCounts:async (req:Request, res:Response) => {
    try {
      const reportCounts = await countReportsByVendor();
      log(reportCounts,'rpcount')
      return res.status(200).json(reportCounts);
    } catch (error:any) {
      console.error('Error getting report counts:', error);
      res.status(500).json({ message: 'Error getting report counts', error: error.message });
    }
  },
  reportDetails : async (req: Request, res: Response) => {
    log('Report details call');
    try {
      const { id } = req.params;
      const report = await Report.find({ vendorId: id }).populate('vendorId', 'name'); // Populate vendor name
      log(report, 'Report details');
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      console.log(report, 'Report details');
      res.status(200).json(report);
    } catch (error: any) {
      res.status(500).json({ message: 'Error getting report details', error: error.message });
    }
  }
    
}