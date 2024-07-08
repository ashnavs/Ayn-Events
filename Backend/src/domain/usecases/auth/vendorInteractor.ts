import { IVendor } from "../../entities/types/vendorTypes"
import { Encrypt } from '../../helper/hashPassword'
import { createVendor,verifyVendorDb,getVendorbyEmail,getVendor,saveLicense,getVendorLicense } from "../../../infrastructure/repositories/mongoVendorrepository";
import { getStoredOTP,saveOtp } from "../../../infrastructure/repositories/mongoUserRepository";
import sendOTPEmail from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { generateTokenVendor } from "../../helper/jwtHelper";
import { uploadToS3 } from "../../../utils/s3Uploader";
// import { License } from "../../../infrastructure/database/dbmodel/licenceModel";
import { LicenseDataRequest, LicenseDataResponse  } from "../../entities/types/licenceType";
import { log } from "console";


export default{
    // registerVendor: async (vendorData: IVendor) => {
    //     console.log('Vendor data:', vendorData);

    //     try {
    //         if (!vendorData.email || !vendorData.name) {
    //             throw new Error('Vendor data is undefined');
    //         }

    //         const existingVendor = await getVendorbyEmail(vendorData.email);
    //         console.log('Existing Vendor:', existingVendor);

    //         if (existingVendor?.is_verified) {
    //             throw new Error('Vendor already exists');
    //         }

    //         if (existingVendor?.is_verified === false && existingVendor?.otp_verified === false) {
    //             console.log('Generating OTP...');
    //             const otp = generateOTP();
    //             console.log('Generated OTP:', otp);

    //             const generatedAt = Date.now();
    //             console.log('Sending OTP email...');
    //             await sendOTPEmail(vendorData.email, otp, vendorData.name);

    //             console.log('Saving OTP...');
    //             const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);

    //             console.log('OTP saved successfully:', savedOtp);

    //             return { message: 'OTP generated successfully', otpGenerated: true };
    //         }

    //         if (existingVendor?.is_verified === false && existingVendor?.otp_verified === true) {

    //             const getLicense = await getVendorLicense(vendorData.email);
    //             console.log('Vendor License:', getLicense);

    //             if (getLicense?.email === vendorData.email) {
    //                 // Show success page instead of license upload page
    //                 return { message: 'Your license is under verification. Please wait for approval.', redirectTo: '/vendor/success' };
    //             }
    //             console.log('Redirecting to license upload...');
    //             return { message: 'Registration success 111111', redirectTo: '/vendor/uploadlicense' };
                
    //         }

    //         const password = vendorData.password as string;
    //         const hashedPassword = await Encrypt.cryptPassword(password);
    //         const savedVendor = await createVendor(vendorData, hashedPassword);
    //         console.log('Saved Vendor:', savedVendor);

    //         return { message: 'Vendor registered successfully', vendor: savedVendor };
    //     } catch (error: any) {
    //         console.error('Error during vendor registration:', error);
    //         throw new Error(error.message);
    //     }
    // }
    
  

   registerVendor : async (vendorData: IVendor) => {
        console.log('Vendor data:', vendorData);
    
        try {
            if (!vendorData.email || !vendorData.name || !vendorData.password) {
                throw new Error('Vendor data is incomplete');
            }
    
            // Check if vendor already exists
            const existingVendor = await getVendorbyEmail(vendorData.email);
            console.log('Existing Vendor:', existingVendor);
    
            if (existingVendor) {
                // Vendor already exists logic
                if (existingVendor.is_verified) {
                    throw new Error('Vendor already exists');
                }
    
                if (!existingVendor.otp_verified) {
                    console.log('Generating OTP...');
                    const otp = generateOTP();
                    console.log('Generated OTP:', otp);
    
                    const generatedAt = Date.now();
                    console.log('Sending OTP email...');
                    await sendOTPEmail(vendorData.email, otp, vendorData.name);
    
                    console.log('Saving OTP...');
                    const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);
                    console.log('OTP saved successfully:', savedOtp);
    
                    return { message: 'OTP generated successfully', otpGenerated: true, redirectTo: '/vendor/otp-verification' };
                } else {
                    const getLicense = await getVendorLicense(vendorData.email);
                    console.log('Vendor License:', getLicense);
    
                    if (getLicense?.email === vendorData.email) {
                        // Show success page instead of license upload page
                        return { message: 'Your license is under verification. Please wait for approval.', redirectTo: '/vendor/success' };
                    }
                    console.log('Redirecting to license upload...');
                    return {
                            message: "Registration success",
                            redirectTo: "/vendor/uploadlicense"
                        }                    
                }
            }
    
            // If vendor doesn't exist, register as a new vendor
            console.log('Generating OTP...');
            const otp = generateOTP();
            console.log('Generated OTP:', otp);
    
            const generatedAt = Date.now();
            console.log('Sending OTP email...');
            await sendOTPEmail(vendorData.email, otp, vendorData.name);
    
            console.log('Saving OTP...');
            const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);
            console.log('OTP saved successfully:', savedOtp);
    
            // Encrypt password
            const hashedPassword = await Encrypt.cryptPassword(vendorData.password);
    
            // Create vendor in database
            const savedVendor = await createVendor({ ...vendorData },hashedPassword);
            console.log('Saved Vendor:', savedVendor);
    
            return { message: 'Vendor registered successfully', vendor: savedVendor, redirectTo: '/vendor/otp-verification' };
        } catch (error:any) {
            console.error('Error during vendor registration:', error);
            throw new Error(error.message || 'Registration failed');
        }
    }
    
    
    ,
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
        const vendors = await getVendor(email)

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

        // if(!existingVendor.is_blocked){
        //     throw new Error('Account is blocked')
        //   }
        
        
        const token = await generateTokenVendor(existingVendor.id , email)
        const vendor = {
            id:existingVendor.id,
            name:existingVendor.name,
            email:existingVendor.email
        }
        return {token , vendor}
    },
    
    uploadVendorLicense: async (licenseData: LicenseDataRequest): Promise<LicenseDataResponse> => {
        const { licenseNumber, email, issueDate, expiryDate, licenseDocument, logo } = licenseData;
      
        const licenseDocumentResult = await uploadToS3(licenseDocument);
        const licenseDocumentUrl = licenseDocumentResult.Location;
      
        const logoResult = await uploadToS3(logo);
        const logoUrl = logoResult.Location;
      
        const completeLicenseData = {
          licenseNumber,
          email,
          issueDate,
          expiryDate,
          licenseDocumentUrl,
          logoUrl,
        };
      
        const savedLicense = await saveLicense(completeLicenseData);
        return savedLicense;
      },
      resendOtp:async(email:string) => {
        try {
            const newOtp = await generateOTP();
            const generatedAt = Date.now();
            const vendors = await getVendorbyEmail(email);
            if(vendors && vendors.name){
                await sendOTPEmail(email, newOtp, vendors.name)
                log('newOtp:',newOtp);
    
                await saveOtp(email,newOtp,generatedAt)
            }else{
                throw new Error('Please signup again')
            }
        } catch (error:any) {
            throw new Error('Failed to resend otp')
        }
      }
      
    
    
}