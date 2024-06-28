import { Router } from 'express';
import vendorController from '../controllers/vendorController';

const vendorRouter = Router()

vendorRouter.post('/signup' , vendorController.vendorRegister)
vendorRouter.post('/otp-vendor', vendorController.verifyOTP);
vendorRouter.post('/login', vendorController.vendorLogin)

export default vendorRouter