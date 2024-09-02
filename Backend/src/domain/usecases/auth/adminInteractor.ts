import { findAdmin } from "../../../infrastructure/repositories/mongoAdminRepository";
import { getAllUsers , updateUserStatus ,updateVendorStatus,updateServiceStatus,getPaginatedUsers, getPaginatedVendors, getUnverifiedVendors, getVendorById, updateVendorVerificationStatus} from "../../../infrastructure/repositories/mongoAdminRepository";
import { generateToken } from "../../helper/jwtHelper";
import { IUser  , PaginatedUsers} from "../../entities/types/userType"; 
import { uploadToS3 } from "../../../utils/s3Uploader";
import { Service ,IService} from "../../../infrastructure/database/dbmodel/serviceModel";




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
    
            const role = 'admin'
            const token = await generateToken(admin.id, cred.email,role)
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
      },
      getVendors : async (page: number, limit: number) => {
        try {
          const vendors = await getPaginatedVendors(page, limit);
          return vendors;
        } catch (error:any) {
          throw new Error(error.message);
        }
      },
    
      fetchVendorById : async (id: string) => {
        try {
          const vendor = await getVendorById(id);
          return vendor; 
        } catch (error) {
          console.error('Error fetching vendor by id:', error);
          throw new Error('Failed to fetch vendor'); 
        }
      },
      verifyVendor: async (id: string, is_verified: boolean)=> {
        try {
          const updated = await updateVendorVerificationStatus(id, is_verified);
          return updated; 
        } catch (error) {
          console.error('Error verifying vendor:', error);
          throw new Error('Failed to verify vendor'); 
        }
      },
      updatedVendorStatus: async (vendorId: string, is_blocked: boolean): Promise<IUser | null> => {
        try {
          const updatedVendor = await updateVendorStatus(vendorId, is_blocked);
          return updatedVendor;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      addService:async(serviceData:{name:string,image:Express.Multer.File}) => {
        try {
          const {Location} = await uploadToS3(serviceData.image)
          
          const newService = new Service({
            name:serviceData.name,
            imageUrl:Location
          })

          const savedService = await newService.save()
          return savedService
        } catch (error) {
          console.error('Error in addService:', error);
          throw error;
        }
      },
      updatedServiceStatus:async (serviceId: string, is_active: boolean): Promise<IService | null> => {
        try {
          const updatedService = await updateServiceStatus(serviceId, is_active);
          return updatedService;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
      
  
}

