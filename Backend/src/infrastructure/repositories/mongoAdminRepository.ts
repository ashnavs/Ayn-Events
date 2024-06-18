import { Admin } from "../database/dbmodel/adminModel";
import { Users } from "../database/dbmodel/userModel";

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


export const updateUserStatus = async (userId: string, isBlocked: boolean) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { is_blocked: isBlocked },
            { new: true }
        );
        return updatedUser;
    } catch (error:any) {
        throw new Error(error.message);
    }
};
