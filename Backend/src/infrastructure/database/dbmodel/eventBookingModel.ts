import mongoose, { Document, Schema } from 'mongoose';


export interface IAddress {
  city: string;
  state: string;
  pincode: number;
  phone: number;
}


export interface IPayment {
  amount: number;
  transaction_id: string;
}


export interface IBooking extends Document {
  date: Date;
  event_name: string;
  vendor_name: string;
  address: IAddress;
  status: string;
  is_confirmed: boolean;
  amount: number;
  user: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  payment: IPayment;
}


const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  phone: { type: Number, required: true }
});


const paymentSchema = new Schema<IPayment>({
  amount: { type: Number, required: true },
  transaction_id: { type: String }
});


const bookingSchema = new Schema<IBooking>({
  date: { type: Date, required: true }, 
  event_name: { type: String, required: true },
  vendor_name: { type: String },
  address: { type: addressSchema, required: true },
  status: { type: String, default: 'pending' },
  is_confirmed: { type: Boolean,default: false },
  amount: { type: Number, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  payment: { type: paymentSchema}
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
