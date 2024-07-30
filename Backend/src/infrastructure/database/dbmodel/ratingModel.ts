// import { Schema, model, Document } from 'mongoose';

// export interface IRating extends Document {
//   vendorId: Schema.Types.ObjectId;
//   userId: Schema.Types.ObjectId;
//   rating: number;
// }

// const ratingSchema = new Schema<IRating>({
//   vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 }
// });

// export const Rating = model<IRating>('Rating', ratingSchema);


import { Schema, model, Document, models } from 'mongoose';

export interface IRating extends Document {
  vendorId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  rating: number;
}

const ratingSchema = new Schema<IRating>({
  vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

export const Rating = models.Rating || model<IRating>('Rating', ratingSchema);

