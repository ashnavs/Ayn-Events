// import mongoose, { Schema, Document } from 'mongoose';

// interface IReport extends Document {
//     vendorId: string;
//     reason: string;
//     date: Date;
// }

// const reportSchema: Schema = new Schema({
//     vendorId: { type: String, required: true },
//     reason: { type: String, required: true },
//     date: { type: Date, required: true }
// });

// const Report = mongoose.model<IReport>('Report', reportSchema);

// export default Report;

import mongoose, { Schema, Document } from 'mongoose';
import { VendorDocument } from './vendorModel'; // Adjust the import path as needed

interface IReport extends Document {
    vendorId: Schema.Types.ObjectId;
    reason: string;
    date: Date;
}

const reportSchema: Schema = new Schema({
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true }
});

const Report = mongoose.model<IReport>('Report', reportSchema);

export default Report;

