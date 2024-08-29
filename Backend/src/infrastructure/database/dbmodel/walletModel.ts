// import mongoose, { Document, Schema } from 'mongoose';

// export interface IWallet extends Document {
//   userId: mongoose.Types.ObjectId;
//   balance: number;
//   transactions: {
//     amount: number;
//     type: 'credit' | 'debit';
//     date: Date;
//   }[];
// }

// const WalletSchema: Schema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//   balance: { type: Number, default: 0 },
//   transactions: [
//     {
//       amount: { type: Number, required: true },
//       type: { type: String, enum: ['credit', 'debit'], required: true },
//       date: { type: Date, default: Date.now }
//     }
//   ],
// });

// export default mongoose.model<IWallet>('Wallet', WalletSchema);




import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITransaction {
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
  booking: Types.ObjectId;  // Use mongoose's ObjectId type
}

export interface IWallet extends Document {
  userId: Types.ObjectId;
  balance: number;
  transactions: ITransaction[];
}

const WalletSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['credit', 'debit'], required: true },
      date: { type: Date, default: Date.now },
      booking: { type: Schema.Types.ObjectId, ref: 'Booking' }  // Ensure correct typing
    }
  ],
});

export default mongoose.model<IWallet>('Wallet', WalletSchema);
