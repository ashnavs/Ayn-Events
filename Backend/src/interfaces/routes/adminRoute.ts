import { Router } from 'express';
import adminController from '../controllers/adminController';

const adminRouter = Router()

adminRouter.post('/login',adminController.adminLogin)
adminRouter.get('/userlist',adminController.getUsers)
// adminRouter.post('/blockUser/:userId',adminController.blockUser)
adminRouter.post('/block-user', adminController.blockUser);


export default adminRouter;

