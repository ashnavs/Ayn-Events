import { Router } from 'express';
import vendorController from '../controllers/vendorController';
import adminController from '../controllers/adminController';
import multer from 'multer';
import { protectVendor } from '../frameworks/webserver/middleware/vendorAuthMiddleware';


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).fields([
  { name: 'licenseDocument', maxCount: 1 },
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }, 
]);

export { upload };


const vendorRouter = Router()

vendorRouter.post('/signup' , vendorController.vendorRegister)
vendorRouter.post('/otp-vendor', vendorController.verifyOTP);
vendorRouter.post('/resend-otp',vendorController.resendOtp)
vendorRouter.post('/login', vendorController.vendorLogin)
vendorRouter.get('/count',vendorController.getVendorCount)
// vendorRouter.post('/uploadlicense', upload.single('licenseDocument'), vendorController.licenseUpload);
vendorRouter.post('/uploadlicense', upload, vendorController.licenseUpload);
vendorRouter.post('/checkAuth',protectVendor,vendorController.checkAuth);
vendorRouter.get('/service-types', vendorController.getServices);
vendorRouter.get('/:id',vendorController.getVendorById);
vendorRouter.post('/posts',upload,vendorController.createPost)
vendorRouter.get('/getposts/:vendorId',vendorController.getPosts)
vendorRouter.put('/:vendorId',vendorController.updateVendor)
vendorRouter.delete('/deleteposts/:postId',vendorController.deletePost)
vendorRouter.get('/bookings/:vendorId',vendorController.bookingDetails)
vendorRouter.patch('/booking/:id',vendorController.updateBookingStatus)
vendorRouter.get('/bookingdetails/:bookingId',vendorController.getBookingDetails)
vendorRouter.get('/active-chats/:vendorId',vendorController.getActiveChats)
vendorRouter.get('/messages/:chatId',vendorController.getMessages)








export default vendorRouter