import { findAdmin } from "../../../infrastructure/repositories/mongoAdminRepository";
import { IAdmin } from "../../entities/types/adminType";
import { getAllUsers , updateUserStatus } from "../../../infrastructure/repositories/mongoAdminRepository";

export default {
    loginAdmin: async(cred:{email:string,password:string}) => {

        const admin = await findAdmin(cred.email)
        if(!admin){
            throw new Error('Admin not found')
        }

        if(cred.password !== admin.password){
            throw new Error('Incorrect password')
        }

        return admin
    },
    userList: async() => {
        const users = getAllUsers();
        return users
    },
    updatedUserStatus:async(userId:string , is_blocked:boolean) => {
        try {
            const updatedUser = await updateUserStatus(userId,is_blocked)
            return updatedUser
        } catch (error:any) {
            throw new Error(error.message)
        }
    }
}

