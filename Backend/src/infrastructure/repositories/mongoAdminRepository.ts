import { Admin } from "../database/dbmodel/adminModel";
import { Users } from "../database/dbmodel/userModel";
import { IUser,PaginatedUsers } from "../../domain/entities/types/userType";

export const findAdmin = async(email:string) => {
    return await Admin.findOne({email})
};

export const getAllUsers = async () => {
    try {
        return await Users.find();
    } catch (error:any) {
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
  
