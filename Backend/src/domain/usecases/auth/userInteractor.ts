import { Iuser } from "../../../infrastructure/database/dbmodel/userModel";
import { createUser , saveOtp,verifyUserDb, getUserbyEMail} from "../../../infrastructure/repositories/mongoUserRepository";
import { Encrypt } from '../../helper/hashPassword'
import { IUser } from "../../entities/types/userType";
import { Request } from "express";
import { generateOTP } from "../../../utils/otpUtils";
import sendOTPEmail from "../../../utils/emailUtils";
import { getStoredOTP } from "../../../infrastructure/repositories/mongoUserRepository";
import { generateToken } from "../../helper/jwtHelper";


export default {
    registerUser: async(userData:IUser) => {
        console.log("userdata usecase", userData);
        
        try {
            if (!userData.email || !userData.name) {
                throw new Error("erroror")
            }
            const otp = await generateOTP();
            console.log("otpppppppp",otp);
            
            const generatedAt = Date.now();
            await sendOTPEmail(userData.email, otp , userData.name)
            const savedOtp = await saveOtp(userData.email , otp , generatedAt);
            
            const password = userData.password as string
            const hashedPassword = await Encrypt.cryptPassword(password)
            const savedUser = await createUser(userData, hashedPassword);

            console.log(savedUser);
            return savedUser;
            
        } catch (error:any) {
            throw error
        }
    },

    verifyUser: async( data:{ otp:string, email:string }) => {
        console.log("body ",data);
        

        if (!data.otp ) {
            throw new Error("no otp")
        }
        const storedOTP = await getStoredOTP(data.email);
        console.log("1111111111111",storedOTP);
        
        if(!storedOTP || storedOTP.otp !== data.otp){
            console.log('invalid otp');
            throw new Error('Invalid Otp')
            
        }
        const otpGeneratedAt  = storedOTP.generatedAt
        

        const currentTime = Date.now()
        const otpAge = currentTime - otpGeneratedAt.getTime();
        const expireOTP = 1 * 60 * 1000
        if(otpAge>expireOTP){
            throw new Error('OTP Expired')
        }

        return await verifyUserDb(data.email)

    },

    loginUser: async(email:string, password:string) => {
        const existingUser = await getUserbyEMail(email);
        if(!existingUser || !existingUser.password){
            throw new Error('User not found');
        }
        const isValid = await Encrypt.comparePassword(password , existingUser.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        // if(existingUser && existingUser.isBlocked){
        //     throw new Error('Account is Blocked');
        // }

        const token = await generateToken(existingUser.id , email)
        const user = {
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email
        }
        return {token,user}
    }


}

