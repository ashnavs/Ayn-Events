import mongoose, { Document, Schema } from 'mongoose';

export interface OTPDocument extends Document {
  otp: string;
  email: string;
  generatedAt: Date;
}

const otpSchema = new Schema<OTPDocument>(
  {
    otp: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      expires: 300 // Expire documents after 5 minutes (300 seconds)
    }
  },
  { timestamps: true }
);

const OTPModel = mongoose.model<OTPDocument>('OTP', otpSchema);

export default OTPModel;
