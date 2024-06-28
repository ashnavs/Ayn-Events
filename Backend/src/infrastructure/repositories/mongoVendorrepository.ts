import { hash } from "crypto";
import { IVendor } from "../../domain/entities/types/vendorTypes";
import { Vendor } from "../database/dbmodel/vendorModel";

export const createVendor = async (vendorData: IVendor, hashedPassword:string) => {
    console.log('vendordata:',vendorData);
    
    const newVendor = new Vendor ({
        name:vendorData.name,
        email:vendorData.email,
        password:hashedPassword,
        is_verified:false

    })
    console.log('newvendor:',newVendor);
    

    return await newVendor.save()
}

export const verifyVendorDb = async(email:string) => {
    const vendorData = await Vendor.findOneAndUpdate(
        { email: email },
        { $set: { otp_verified:true} },
        { new: true }
    );
    return vendorData
}

export const getVendorbyEmail = async (email:string)=> {
    return await Vendor.findOne({email:email})
}

export const getAllVendors = async(email:string) => {
    return await Vendor.findOne({email:email})
}

export const verifyVendor = async (email:string)=> {
    return await Vendor.findOneAndUpdate(
        {email:email},
        {$set:{is_verified:true}},
        {new:true}
    )
}



