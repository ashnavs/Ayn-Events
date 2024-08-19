import { Iuser, Users } from "../../../infrastructure/database/dbmodel/userModel";
import { createUser , saveOtp,verifyUserDb, getUserbyEMail, googleUser, checkExistingUser, getStatus } from "../../../infrastructure/repositories/mongoUserRepository";
import { Encrypt } from '../../helper/hashPassword'
import { IUser } from "../../entities/types/userType";
import { generateOTP } from "../../../utils/otpUtils";
import sendOTPEmail from "../../../utils/emailUtils";
import { getStoredOTP } from "../../../infrastructure/repositories/mongoUserRepository";
import { generateToken } from "../../helper/jwtHelper";
import { getVendor } from "../../../infrastructure/repositories/mongoVendorrepository";
import { createReport } from "../../../infrastructure/repositories/mongoReportRepository";
import { log } from "console";
import { createReview } from "../../../infrastructure/repositories/mongoReviewRepository";
import { IBooking } from "../../../infrastructure/database/dbmodel/eventBookingModel";
import { saveBooking , checkAvailabilityByDate } from "../../../infrastructure/repositories/mongoBookingRepository";

function createError(message: string, status: number) {
    const error: any = new Error(message);
    error.status = status;
    return error;
}


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
        const role = 'user'

        const {token,refreshToken} = await generateToken(existingUser.id , email ,role)
        const user = {
            id:existingUser.id,
            name:existingUser.name,
            email:existingUser.email,
            isBlocked:existingUser.is_blocked
        }
        return {token,user,refreshToken}
    },
   
    

    googleUser:async(userData:IUser) => {
        try {
            const savedUser = await  googleUser(userData)
            console.log("saveduser:",savedUser);
            
        if(savedUser){
            const user = {
                id: savedUser._id,
                name:savedUser.name,
                email:savedUser.email
            }

            console.log("User Object:", user);


            if (!savedUser._id || !savedUser.email) {
                throw new Error("User ID or email is undefined");
            }
            if (savedUser.is_blocked) {
                throw createError('Account is Blocked', 403); // Forbidden
            }
            const role = 'user'
            let {token,refreshToken} = generateToken(savedUser.id,savedUser.email,role)
            log(token,refreshToken,"refresh")
            return {user,token,refreshToken}
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
            throw new Error('Failed to get vendor')
        }
    },
    reportVendor:async(vendorId:string, reason:string) => {
        try {
            const report = await createReport(vendorId,reason)
            console.log(report,"rrrr")
            return report
        } catch (error) {
            console.error('Error in user interactor:', error);
            throw new Error('Error processing report');        }
    },
    createReview: async(reviewData:{vendorId:string,userId:string,review:string,rating:number}) => {
        try {
            const reviews = await createReview(reviewData);
            return reviews
        } catch (error) {
            console.error('Error in user interactor:', error);
            throw new Error('Error processing review'); 
        }
    },
    checkBookingAvailability : async (date: Date, vendorId: string): Promise<boolean> => {
        const existingBooking = await checkAvailabilityByDate(date, vendorId);
        return !existingBooking;
      },
      
      addNewBooking: async (bookingData: IBooking): Promise<IBooking> => {
        try {
          const newBooking = await saveBooking(bookingData);
          console.log('Booking added:', newBooking);
          return newBooking;
        } catch (error) {
          console.error('Error adding booking:', error);
          throw new Error('Error adding booking');
        }
      },
      



}

