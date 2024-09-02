import { Router } from 'express';
import adminController from '../controllers/adminController';
import multer from 'multer';
import { protectAdmin } from '../frameworks/webserver/middleware/adminAuthMiddleware';

const adminRouter = Router()

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');




adminRouter.post('/login',adminController.adminLogin)
adminRouter.get('/userlist',protectAdmin,adminController.getUsers)
adminRouter.get('/users', adminController.getUsers); 
adminRouter.patch('/blockUser/:userId',adminController.blockUser);
adminRouter.get('/verifyvendor',protectAdmin,adminController.getVendors)
adminRouter.get('/vendor/:id',protectAdmin,adminController.getVendorById);
adminRouter.get('/license/:email', protectAdmin,adminController.getLicenseByVendorEmail);
adminRouter.patch('/updatestatus/:id',protectAdmin, adminController.updateVendorVerificationStatus);
adminRouter.patch('/updateisverified/:vendorId',protectAdmin, adminController.updateIsVerified);
adminRouter.get('/vendorlist',protectAdmin,adminController.getVerifiedVendors)
adminRouter.patch('/blockVendor/:vendorId',protectAdmin, adminController.blockVendor);
adminRouter.post('/addservice',protectAdmin, upload, adminController.addService);
adminRouter.get('/get-services', protectAdmin,adminController.getServices);
adminRouter.patch('/blockService/:serviceId', protectAdmin,adminController.blockService);
adminRouter.get('/reportlist',adminController.getReportCounts)
adminRouter.get('/reports/:id',adminController.reportDetails)


 


export default adminRouter;

