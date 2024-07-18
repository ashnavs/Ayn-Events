import { hash } from "crypto";
import { IVendor } from "../../domain/entities/types/vendorTypes";
import { Vendor } from "../database/dbmodel/vendorModel";
import {LicenseModel, License } from "../database/dbmodel/licenceModel";
import { LicenseDataResponse } from "../../domain/entities/types/licenceType";


export const createVendor = async (vendorData: IVendor, hashedPassword:string) => {
    console.log('vendordata:',vendorData);
    
    const newVendor = new Vendor ({
        name:vendorData.name,
        email:vendorData.email,
        password:hashedPassword,
        city:vendorData.city,
        service:vendorData.service,
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

export const getVendor = async(email:string) => {
    return await Vendor.findOne({email:email})
}

export const verifyVendor = async (email:string)=> {
    return await Vendor.findOneAndUpdate(
        {email:email},
        {$set:{is_verified:true}},
        {new:true}
    )
}


export const saveLicense = async (licenseData: LicenseDataResponse): Promise<License> => {
    const license = new LicenseModel(licenseData);
    return await license.save();
  };


export const getVendorLicense = async(email:string) => {
    return await LicenseModel.findOne({email:email})
}

export const getAllVendors = async() => {
    return await Vendor.find({is_verified:true},{_id:1,name:1,email:1,city:1,vendorType:1,is_blocked:1})
}
