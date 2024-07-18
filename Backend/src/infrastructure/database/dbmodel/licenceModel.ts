// // // licenseModel.ts
// // import mongoose, { Schema, Document } from 'mongoose';

// // interface License extends Document {
// //   licenseNumber: string;
// //   email: string;
// //   issueDate: Date;
// //   expiryDate: Date;
// //   userId: string;
// //   licenseDocumentUrl: string;
// // }

// // const LicenseSchema: Schema = new Schema({
// //   licenseNumber: { type: String, required: true },
// //   email: { type: String, required: true },
// //   issueDate: { type: Date, required: true },
// //   expiryDate: { type: Date, required: true },
// //   userId: { type: String, required: true },
// //   licenseDocumentUrl: { type: String, required: true },
// // });

// // export const License = mongoose.model<License>('License', LicenseSchema);

// import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface License extends Document {
//   // vendorId: mongoose.Types.ObjectId,
//   licenseNumber: string;
//   email: string;
//   issueDate: string;
//   expiryDate: string;
//   licenseDocumentUrl: string;

// }

// const LicenseSchema: Schema = new Schema({
//   // vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
//   licenseNumber: { type: String, required: true },
//   email: { type: String, required: true },
//   issueDate: { type: String, required: true },
//   expiryDate: { type: String, required: true },
//   licenseDocumentUrl: { type: String, required: true },

// });

// export const LicenseModel: Model<License> = mongoose.model<License>('License', LicenseSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface License extends Document {
  licenseNumber: string;
  email: string;
  issueDate: string;
  expiryDate: string;
  licenseDocumentUrl: string;
  logoUrl: string; 
}

const LicenseSchema: Schema = new Schema({
  licenseNumber: { type: String, required: true },
  email: { type: String, required: true },
  issueDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  licenseDocumentUrl: { type: String, required: true },
  logoUrl: { type: String }, 
});

export const LicenseModel: Model<License> = mongoose.model<License>('License', LicenseSchema);
