import { Admin } from "../database/dbmodel/adminModel";
import { Users } from "../database/dbmodel/userModel";
import { IUser, PaginatedUsers } from "../../domain/entities/types/userType";
import { Vendor } from "../database/dbmodel/vendorModel";
import { PaginatedVendors } from "../../domain/entities/types/vendorTypes";
import { LicenseModel } from "../database/dbmodel/licenceModel";
import{ Service , IService} from "../database/dbmodel/serviceModel";
import { log } from "console";


export const findAdmin = async (email: string) => {
  return await Admin.findOne({ email })
};

export const getAllUsers = async () => {
  try {
    return await Users.find();
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const getPaginatedUsers = async (page: number, limit: number): Promise<PaginatedUsers> => {
  try {
    const users = await Users.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalUsers = await Users.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateUserStatus = async (userId: string, isBlocked: boolean): Promise<IUser | null> => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      userId,
      { is_blocked: isBlocked },
      { new: true }
    );
    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getPaginatedVendors = async (page: number, limit: number) => {
  try {
    const vendors = await Vendor.find({ is_verified: false })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalVendors = await Vendor.countDocuments();
    const totalPages = Math.ceil(totalVendors / limit);

    return {
      vendors,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUnverifiedVendors = async (page: number, limit: number) => {
  const vendors = await Vendor.find({ is_verified: false })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalVendors = await Vendor.countDocuments();
  return {
    vendors,
    totalPages: Math.ceil(totalVendors / limit),
  };
};

export const getVendorById = async (id: string) => {
  return await Vendor.findById(id);
};

export const updateVendorVerificationStatus = async (id: string, is_verified: boolean) => {
  return await Vendor.findByIdAndUpdate(id, { is_verified: true }, { new: true });
};

export const updateVendorStatus = async (vendorId: string, isBlocked: boolean): Promise<IUser | null> => {
  try {
    const updatedVndor = await Vendor.findByIdAndUpdate(
      vendorId,
      { is_blocked: isBlocked },
      { new: true }
    );
    log(updatedVndor,'upvendor')
    return updatedVndor;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getServices = async (page: number, limit: number) => {
  try {
    const services = await Service.find()
      .skip((page - 1) * limit)
      .limit(limit);
    const totalServices = await Service.countDocuments();
    const totalPages = Math.ceil(totalServices / limit);

    return {
      services,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getServiceName = async() => {
  return await Service.find({name:1})
}

export const updateServiceStatus = async (serviceId: string, isBlocked: boolean): Promise<IService | null> => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {is_active: !isBlocked },
      { new: true }
    );
    return updatedService;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

