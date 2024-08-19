import { Router } from 'express';
import userController from '../controllers/userController';
import { protectUser } from '../frameworks/webserver/middleware/userAuthMiddleware';
import vendorController from '../controllers/vendorController';
import chatController  from '../controllers/chatController';



const userRouter = Router();

userRouter.post('/signup',userController.userRegistration);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/resend-otp',userController.resendOTP)
userRouter.post('/login',userController.userLogin);
userRouter.post('/googleAuth',userController.googleAuth);
userRouter.get('/getStatus',userController.getStatus);
userRouter.get('/license/:email',protectUser, userController.getLicenseByVendorEmail);
userRouter.post('/checkAuth',protectUser,userController.checkAuth);
userRouter.get('/verifyvendor',userController.getVendor);
userRouter.get('/category',protectUser,userController.getServiceUser);
userRouter.post('/refreshtoken',userController.refreshToken);
userRouter.get('/vendorDetails/:id',userController.getVendorDetails);
userRouter.post('/report',userController.reportVendor);
userRouter.get('/getposts/:vendorId',userController.getPosts)
userRouter.post('/reviews',userController.createReview)
userRouter.get('/getreviews',userController.getReviews)
userRouter.post('/booking',userController.bookEvents)
userRouter.post('/checkAvailability',userController.checkAvailability)
userRouter.get('/bookings', userController.getBookings)
userRouter.get('/vendors',userController.getVendors)
userRouter.put('/updateuser/:userId',userController.updateUser)
// userRouter.get('/bookingdetails/:bookingId',userController.getBookingDetails)
userRouter.get('/booking/:userId',userController.bookingDetails)
userRouter.patch('/bookings/:bookingId/cancel',userController.updateBookingStatus)
userRouter.put('/change-password',userController.changePassword)
userRouter.get('/count',userController.getUserCount)
userRouter.get('/bookingdetails/:bookingId',vendorController.getBookingDetails)
userRouter.patch('/:roomId/accept',chatController.acceptChatRequest)
userRouter.get('/active-chats/:userId',userController.getActiveChats)
userRouter.get('/messages/:roomId',userController.getMessagesByRoomId)
userRouter.get('/rooms/:roomId',userController.getMessagesByRoomId)
// userRouter.post()









export default userRouter;
