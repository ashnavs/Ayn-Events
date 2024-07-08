import { Router } from 'express';
import adminController from '../controllers/adminController';
import multer from 'multer';

const adminRouter = Router()

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');




adminRouter.post('/login',adminController.adminLogin)
adminRouter.get('/userlist',adminController.getUsers)
adminRouter.get('/users', adminController.getUsers); 
adminRouter.patch('/blockUser/:userId', adminController.blockUser);
adminRouter.get('/verifyvendor',adminController.getVendors)
// adminRouter.get('/unverified', adminController.getUnverifiedVendors);
adminRouter.get('/vendor/:id', adminController.getVendorById);
adminRouter.get('/license/:email', adminController.getLicenseByVendorEmail);
adminRouter.patch('/updatestatus/:id', adminController.updateVendorVerificationStatus);
adminRouter.patch('/updateisverified/:vendorId', adminController.updateIsVerified);
adminRouter.get('/vendorlist',adminController.getVerifiedVendors)
adminRouter.patch('/blockVendor/:vendorId', adminController.blockVendor);
adminRouter.post('/addservice', upload, adminController.addService);
adminRouter.get('/get-services', adminController.getServices);
adminRouter.patch('/blockService/:serviceId', adminController.blockService);


 


export default adminRouter;

