import  { Iuser, Users } from "../database/dbmodel/userModel";
import { IUser } from "../../domain/entities/types/userType";
import OTPModel from "../database/dbmodel/otpModel";

export const getUserbyEMail = async (email:string)=> {
    return await Users.findOne({email:email})
}

export const checkExistingUser = async(email:string, name:string) => {
    const existingUser = await Users.findOne({ $or: [{email:email},{name:name}]})
    return existingUser
}

export const createUser = async (userData: IUser, hashedPassword:string): Promise<IUser> => {
    // return await userModel.create(user);
    console.log("saved user",userData);
    if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
      }

    const email = userData.email as string
    const name = userData.name as string
    const existingUser = await checkExistingUser(email, name)
    if(existingUser){
        if(existingUser.is_verified === false){
            return existingUser
        }
        throw new Error('User already exist')
    }
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, email, and password are required fields");
    }
    
    const newUser = new Users({
        name: userData.name,
        email: userData.email,
        password:hashedPassword
      });

    return await newUser.save();
}

export const verifyUserDb = async(email:string) => {
    const userData = await Users.findOneAndUpdate(
        { email: email },
        { $set: { is_verified:true} },
        { new: true }
    );
    return userData
}


export const saveOtp = async (email: string, otp: string, generatedAt: number) => {
    try {
      const otpForStore = new OTPModel({ otp, email, generatedAt });
     return await otpForStore.save();
      
      
    } catch (error) {
      console.error('Error saving OTP:', error);
      throw new Error('Error saving OTP');
    }

  };

  export const getStoredOTP = async( email: string )=> await OTPModel.findOne({email:email});