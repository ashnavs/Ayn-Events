
  
 import mongoose, { Document, Schema } from "mongoose";

export interface Service {
    name: string;
    price: number;
}

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
    services: Service[];
    is_verified: boolean;
    is_blocked: boolean;
    total_bookings: number;
    otp_verified: boolean;
}

interface VendorQuery {
    service?: string;
    city?: string;
}

export interface UpdateVendorData {
  name?: string;
  city?: string;
  services?: {
    name: string;
    price: number;
  }[];
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
    services: [{ 
        name: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    is_verified: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    total_bookings: { type: Number },
    otp_verified: { type: Boolean, default: false }
});

export const Vendor = mongoose.model<VendorDocument>('Vendor', vendorSchema);
