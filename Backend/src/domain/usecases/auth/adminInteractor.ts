import { findAdmin } from "../../../infrastructure/repositories/mongoAdminRepository";
import { IAdmin } from "../../entities/types/adminType";
import { getAllUsers , updateUserStatus ,getPaginatedUsers } from "../../../infrastructure/repositories/mongoAdminRepository";
import { generateToken } from "../../helper/jwtHelper";
import { IUser  , PaginatedUsers} from "../../entities/types/userType"; 

export default {
    loginAdmin: async(cred:{email:string,password:string})  => {

        try {
            const admin = await findAdmin(cred.email)
            if(!admin){
                throw new Error('Admin not found')
            }
    
            if(cred.password !== admin.password){
                throw new Error('Incorrect password')
            }
    
            const token = await generateToken(admin.id, cred.email)
    
            return {admin,token}
        } catch (error:any) {
            console.error(`Error: ${error.message}`);
            throw error;            
        }
    },
    userList: async() => {
        const users = getAllUsers();
        return users
    },
    getUsers: async (page: number, limit: number): Promise<PaginatedUsers> => {
        try {
          const users = await getPaginatedUsers(page, limit);
          return users;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      updatedUserStatus: async (userId: string, is_blocked: boolean): Promise<IUser | null> => {
        try {
          const updatedUser = await updateUserStatus(userId, is_blocked);
          return updatedUser;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
}

