import { Router } from 'express';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.post('/signup', userController.userRegistration);
userRouter.post('/otp-verification', userController.verifyOTP);
userRouter.post('/login',userController.userLogin)

// userRouter.post('/otp-verification', verifyOTP );

export default userRouter;
