import mongoose, { Schema, Document } from 'mongoose';

interface IService extends Document {
  name?: string;
  imageUrl?: string; 
  createdAt?: Date;
  is_active?: boolean;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true }
});

const Service = mongoose.model<IService>('Service', ServiceSchema);

export { Service, IService };
