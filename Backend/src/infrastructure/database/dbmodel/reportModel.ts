import { Schema, model, Document } from "mongoose";

export interface ReviewModel  {
  vendorId: string;
  userId: string;
  review: string;
}


const reviewSchema = new Schema({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: String, required: true },
}, {
  timestamps: true, 
});


const Review = model<ReviewModel>('Review', reviewSchema);

export default Review;
