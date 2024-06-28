import { Router } from 'express';
import adminController from '../controllers/adminController';

const adminRouter = Router()

adminRouter.post('/login',adminController.adminLogin)
adminRouter.get('/userlist',adminController.getUsers)
adminRouter.get('/users', adminController.getUsers); 
adminRouter.patch('/blockUser/:userId', adminController.blockUser);
adminRouter.patch('/block-user', adminController.blockUser);


export default adminRouter;

