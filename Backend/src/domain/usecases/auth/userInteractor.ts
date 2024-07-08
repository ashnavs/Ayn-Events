import { Iuser, Users } from "../../../infrastructure/database/dbmodel/userModel";
import { createUser , saveOtp,verifyUserDb, getUserbyEMail, googleUser, checkExistingUser, getStatus } from "../../../infrastructure/repositories/mongoUserRepository";
import { Encrypt } from '../../helper/hashPassword'
import { IUser } from "../../entities/types/userType";
import { generateOTP } from "../../../utils/otpUtils";
import sendOTPEmail from "../../../utils/emailUtils";
import { getStoredOTP } from "../../../infrastructure/repositories/mongoUserRepository";
import { generateToken } from "../../helper/jwtHelper";
import { getVendor } from "../../../infrastructure/repositories/mongoVendorrepository";


export default {
    registerUser: async(userData:IUser) => {
        console.log("userdata usecase", userData);
        
        try {
            if (!userData.email || !userData.name) {
                throw new Error("user data undefined")
            }
            
            const existingUser = await checkExistingUser(userData.email,userData.name);
            if(existingUser && existingUser.is_verified == true){
                throw new Error('User already exist')
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
        if(existingUser && existingUser.is_blocked){
            throw new Error('Account is Blocked');
        }
        if(existingUser.is_verified == false){
            throw new Error(`User is not verified.Register!`)
        }

        const token = await generateToken(existingUser.id , email)
        const user = {
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email
        }
        return {token,user}
    },

    googleUser:async(userData:IUser) => {
        try {
            const savedUser = await  googleUser(userData)
        if(savedUser){
            const user = {
                id: savedUser._id,
                name:savedUser.name,
                email:savedUser.email
            }

            if (!savedUser._id || !savedUser.email) {
                throw new Error("User ID or email is undefined");
            }

            let token = generateToken(savedUser.id,savedUser.email)
            return {user,token}
        }
        } catch (error:any) {
            console.error(error.message)
            throw error
        }
    },
    getStatus:async(id:string) => {
        try {
           return await getStatus(id)
            
        } catch (error:any) {
            console.error(error.message)
            throw error
        }
    },
    otpResend:async(email:string) => {
        try {
            const newotp = await generateOTP();
            const generatedAt = Date.now();
            const users = await getUserbyEMail(email)
            if(users && users.name){
                await sendOTPEmail(email, newotp, users.name)
                console.log('newOtp:',newotp);
                
                await saveOtp(email,newotp,generatedAt)
            }else{
                throw new Error('Please signup again')
            }
            
        } catch (error) {
            throw new Error('Failed to resend otp')
        }
    },
    getVendor:async(id:string) => {
        try {
            return await getVendor(id)
        } catch (error) {
            
        }
    }
    


}

