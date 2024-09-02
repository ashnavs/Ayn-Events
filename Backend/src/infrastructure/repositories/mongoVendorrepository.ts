import { hash } from "crypto";
import { IVendor ,UpdateVendorData } from "../../domain/entities/types/vendorTypes";
import { Vendor ,VendorDocument } from "../database/dbmodel/vendorModel";
import {LicenseModel, License } from "../database/dbmodel/licenceModel";
import { LicenseDataResponse } from "../../domain/entities/types/licenceType";
import { Service } from "../database/dbmodel/serviceModel";
import { log } from "console";



export const createVendor = async (vendorData: IVendor, hashedPassword: string) => {
    console.log('vendorData:', vendorData);


    const formattedServices = vendorData.services.map(service => {
        if (typeof service === 'string') {
            return { name: service, price: 0 }; 
        } else {
            return service;
        }
    });

    const newVendor = new Vendor({
        name: vendorData.name,
        email: vendorData.email,
        password: hashedPassword,
        city: vendorData.city,
        services: formattedServices,
        is_verified: false
    });

    console.log('newVendor:', newVendor);

    return await newVendor.save();
};

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
    console.log('got vendor')
    return await Vendor.find({is_verified:true , is_blocked:false},{_id:1,name:1,email:1,city:1,service:1,is_blocked:1})
    
}
interface ServiceType {
    _id: string;
    name: string;
    imageUrl: string;
    is_active: string;
  }

//new:
export const getVendorsWithService = async () => {
    try {
        const vendors = await Vendor.find({
            is_verified: true,
            is_blocked: false
        }, {
            _id: 1,
            name: 1,
            email: 1,
            city: 1,
            services: 1 // Ensure you are fetching the correct field name
        }).lean();

        console.log("Fetched vendors:", vendors);

        // Extract unique service names
        const services: string[] = [];
        vendors.forEach((vendor) => {
            if (vendor.services) {
                vendor.services.forEach((service) => {
                    if (service && !services.includes(service.name)) {
                        services.push(service.name);
                    }
                });
            }
        });

        console.log("Extracted services:", services);

        const matchingServices: ServiceType[] = await Service.find({ name: { $in: services } }).lean();
    log("matchingServices1",matchingServices)

        return { vendors, matchingServices };
    } catch (error) {
        console.error("Error fetching vendors and services:", error);
        throw error;
    }
};



export const updateVendor = async(id: string, data: UpdateVendorData): Promise<VendorDocument | null >  => {
    console.log(id,"😤😤😤")
    try {
        console.log("😤😤😤")
        const updatedVendor = await Vendor.findByIdAndUpdate(id, data, { new: true }).exec();
        console.log(updatedVendor,"😤😤😤")
        return updatedVendor;
      } catch (error:any) {
        throw new Error(`Failed to update vendor: ${error.message}`);
      }
    }
  


export const vendorCount = async (): Promise<number> => {
    try {
        const vendorCount = await Vendor.countDocuments();
        console.log(vendorCount,"vendorcounts")
        return vendorCount;
    } catch (error:any) {
        throw new Error(`Failed to get vendor count: ${error.message}`);
    }
};