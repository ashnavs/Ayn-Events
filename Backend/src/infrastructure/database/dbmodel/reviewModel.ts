import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  vendorId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  review: string;
}

const reviewSchema = new Schema<IReview>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: String, required: true }
});

export const Review = model<IReview>('Review', reviewSchema);
