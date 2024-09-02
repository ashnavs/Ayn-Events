

import mongoose, { Schema, Document } from 'mongoose';
import { VendorDocument } from './vendorModel'; 

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

