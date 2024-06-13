import mongoose, { Document, Schema } from 'mongoose';

export interface Iuser extends Document {
  name?: string;
  email?: string;
  password?: string;
  favorites?: string[];
  is_verified?: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: { type: [String], default: [] },
  is_verified: { type: Boolean, default:false },
  is_google: { type: Boolean, default:false }


});

export const Users =  mongoose.model<Iuser>('User', UserSchema);
