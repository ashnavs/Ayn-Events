import {Schema , model } from 'mongoose';

export interface PostModel{
    vendorId?:string;
    description?:string;
    image?:string;
    createdAt?:Date;
    active?:boolean;
}

const PostSchema : Schema = new Schema({
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    description: { type:String , required: true },
    image: { type:String, required:true },
    createdAt: { type: Date, default: Date.now },
    active: {type:Boolean, default:true }
})

const Post = model('Post' , PostSchema);

export default Post;