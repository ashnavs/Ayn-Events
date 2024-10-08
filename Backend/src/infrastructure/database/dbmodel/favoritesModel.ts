import mongoose, { Document, Schema } from 'mongoose';

interface IFavorite extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  vendorId: mongoose.Schema.Types.ObjectId;
  isFavorite: boolean;
}

const FavoriteSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vendorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true 
  },
  isFavorite: { type: Boolean, required: true },
});

export const Favorite = mongoose.model<IFavorite>('Favorite', FavoriteSchema);
