import { Router } from 'express';
import userController from '../controllers/userController';
import { protectUser } from '../frameworks/webserver/middleware/userAuthMiddleware';


const userRouter = Router();

userRouter.post('/signup',userController.userRegistration);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/resend-otp',userController.resendOTP)
userRouter.post('/login',userController.userLogin);
userRouter.post('/googleAuth',userController.googleAuth);
userRouter.get('/getStatus',userController.getStatus);
userRouter.post('/checkAuth',protectUser,userController.checkAuth);
userRouter.get('/verifyvendor',userController.getVendor)
userRouter.get('/category',userController.getService)




export default userRouter;
