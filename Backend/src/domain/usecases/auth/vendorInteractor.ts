import { IVendor } from "../../entities/types/vendorTypes"
import { Encrypt } from '../../helper/hashPassword'
import { createVendor,verifyVendorDb,getVendorbyEmail,getAllVendors } from "../../../infrastructure/repositories/mongoVendorrepository";
import { getStoredOTP,saveOtp } from "../../../infrastructure/repositories/mongoUserRepository";
import sendOTPEmail from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { generateTokenVendor } from "../../helper/jwtHelper";





export default{
    registerVendor:async(vendorData:IVendor) => {
        console.log('vendor data',vendorData);

        try {
            if(!vendorData.email||!vendorData.name){
                throw new Error('vendor data undefined')
            }

            const otp=await generateOTP()
            console.log('otpppp',otp);

            const generatedAt = Date.now();
            await sendOTPEmail(vendorData.email, otp , vendorData.name)
            const savedOtp = await saveOtp(vendorData.email , otp , generatedAt);
            

            const password = vendorData.password as string
            const hashedPassword = await Encrypt.cryptPassword(password)
            const savedVendor = await createVendor(vendorData, hashedPassword)
            console.log("//////",savedVendor);
            
            return savedVendor;
        } catch (error) {
            
        }
        
    },
     verifyVendor: async( data:{ otp:string, email:string }) => {
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

        return await verifyVendorDb(data.email)

    },
    loginVendor:async(email:string , password:string) => {
        const existingVendor = await getVendorbyEmail(email);
        const vendors = await getAllVendors(email)

        if(!existingVendor || !existingVendor.password){
            throw new Error('User not found');
        }

        const isValid = await Encrypt.comparePassword(password , existingVendor.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }

        if(!vendors){
            throw new Error('vendor is not found')
        }

        if(!existingVendor.is_verified){
          throw new Error('Account is not verified')
        }
        
        
        const token = await generateTokenVendor(existingVendor.id , email)
        const vendor = {
            id:existingVendor.id,
            name:existingVendor.name,
            email:existingVendor.email
        }
        return {token , vendor}
    },

}