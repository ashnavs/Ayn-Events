import mongoose, { Document, Schema } from "mongoose";

export interface VendorDocument extends Document {
    name: string;
    email: string;
    city: string;
    eventname: string;
    password: string;
    logoUrl?: string;
    licenseUrl?: string;
    logo: string;
    coverpicture: string;
    about: string;
    //review here
    vendorType: string;
    is_verified: boolean;
    verify_request: boolean;
    total_bookings: number;
    otp_verified:boolean;


  }
  
  const vendorSchema = new Schema<VendorDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    city: { type: String },
    eventname: { type: String },
    password: { type: String, required: true },
    logoUrl: { type: String },
    licenseUrl: { type: String },
    logo: { type: String },
    coverpicture: { type: String },
    about: { type: String },
    vendorType: { type: String },
    is_verified: { type: Boolean},
    verify_request: { type: Boolean },
    total_bookings: { type: Number },
    otp_verified: {type:Boolean},
  });
  
  export const Vendor = mongoose.model<VendorDocument>('Vendor', vendorSchema);
  
 