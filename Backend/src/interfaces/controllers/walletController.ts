// import { Request, Response } from 'express';
// import walletModel from '../../infrastructure/database/dbmodel/walletModel';
// import { Users } from '../../infrastructure/database/dbmodel/userModel';// Assuming you have a user model

// export const addFunds = async (req: Request, res: Response) => {
//   const { userId, amount } = req.body;

//   try {
//     let wallet = await walletModel.findOne({ userId });
//     if (!wallet) {
//       // If wallet doesn't exist, create one
//       wallet = new walletModel({
//         userId,
//         balance: amount,
//         transactions: [{ amount, type: 'credit', date: new Date() }]
//       });
//     } else {
//       wallet.balance += amount;
//       wallet.transactions.push({ amount, type: 'credit', date: new Date() });
//     }

//     await wallet.save();
//     res.status(200).json({ message: 'Funds added successfully', wallet });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding funds', error });
//   }
// };

// export const processTransaction = async (req: Request, res: Response) => {
//   const { userId, amount } = req.body;

//   try {
//     const wallet = await walletModel.findOne({ userId });
//     if (!wallet) return res.status(404).json({ message: 'Wallet not found' });

//     if (wallet.balance < amount) {
//       return res.status(400).json({ message: 'Insufficient funds' });
//     }

//     wallet.balance -= amount;
//     wallet.transactions.push({ amount, type: 'debit', date: new Date() });
//     await wallet.save();

//     res.status(200).json({ message: 'Transaction successful', wallet });
//   } catch (error) {
//     res.status(500).json({ message: 'Error processing transaction', error });
//   }
// };
