// BookingModel.ts

import mongoose, { Document, Schema } from 'mongoose';

// Address Interface
export interface IAddress {
  city: string;
  state: string;
  pincode: number;
  phone: number;
}

// Payment Interface
export interface IPayment {
  amount: number;
  transaction_id: string;
}

// Booking Interface
export interface IBooking extends Document {
  date: Date;
  event_name: string;
  vendor_name: string;
  address: IAddress;
  status: boolean;
  payment_status: boolean;
  amount: number;
  user: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  payment: IPayment;
}

// Address Schema
const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  phone: { type: Number, required: true }
});

// Payment Schema
const paymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  transaction_id: { type: String }
});

// Booking Schema
const bookingSchema = new Schema<IBooking>({
  date: { type: Date, required: true },
  event_name: { type: String },
  vendor_name: { type: String },
  address: { type: addressSchema, required: true },
  status: { type: Boolean, default: false },
  payment_status: { type: Boolean,default: true },
  amount: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  payment: { type: paymentSchema}
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
