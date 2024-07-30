// paymentController.ts
import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import eventBookingModel from '../../infrastructure/database/dbmodel/eventBookingModel';

dotenv.config();



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET_KEY!,
});

export default {

verifyPayment : async (req: Request, res: Response) => {
  const { paymentId, orderId, signature } = req.body;

  try {
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY!)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // Signature is valid
      // Update booking status to 'paid'
      await updateBookingStatus(paymentId, orderId);

      res.json({ message: 'Payment verified successfully' });
    } else {
      // Signature is invalid
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error:any) {
    res.status(500).json({ error: error.message });
  }
},

updateBookingStatus : async (paymentId: string, orderId: string) => {
    try {
      const booking = await eventBookingModel.findOne({ orderId });
  
      if (booking) {
        booking.payment_status = true;
        booking.payment.transaction_id = paymentId;
        booking.status = true; // or update based on your business logic
        await booking.save();
      } else {
        console.log(`Booking with orderId ${orderId} not found`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  },
  
}

