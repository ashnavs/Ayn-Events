import { IVendor } from "../../entities/types/vendorTypes"
import { Encrypt } from '../../helper/hashPassword'
import { createVendor,verifyVendorDb,getVendorbyEmail,getVendor,saveLicense,getVendorLicense } from "../../../infrastructure/repositories/mongoVendorrepository";
import { getStoredOTP,saveOtp } from "../../../infrastructure/repositories/mongoUserRepository";
import sendOTPEmail from "../../../utils/emailUtils";
import { generateOTP } from "../../../utils/otpUtils";
import { generateToken } from "../../helper/jwtHelper";
import { uploadToS3 } from "../../../utils/s3Uploader";
import { LicenseDataRequest, LicenseDataResponse  } from "../../entities/types/licenceType";
import { log } from "console";
import Post from "../../../infrastructure/database/dbmodel/postModel";


export default{
   
  

   registerVendor : async (vendorData: IVendor) => {
        console.log('Vendor data:', vendorData);
    
        try {
            if (!vendorData.email || !vendorData.name || !vendorData.password) {
                throw new Error('Vendor data is incomplete');
            }
    
            const existingVendor = await getVendorbyEmail(vendorData.email);
            console.log('Existing Vendor:', existingVendor);
    
            if (existingVendor) {
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
                        return { message: 'Your license is under verification. Please wait for approval.', redirectTo: '/vendor/success' };
                    }
                    console.log('Redirecting to license upload...');
                    return {
                            message: "Registration success",
                            redirectTo: "/vendor/uploadlicense"
                        }                    
                }
            }
    
            console.log('Generating OTP...');
            const otp = generateOTP();
            console.log('Generated OTP:', otp);
    
            const generatedAt = Date.now();
            console.log('Sending OTP email...');
            await sendOTPEmail(vendorData.email, otp, vendorData.name);
    
            console.log('Saving OTP...');
            const savedOtp = await saveOtp(vendorData.email, otp, generatedAt);
            console.log('OTP saved successfully:', savedOtp);
    
            const hashedPassword = await Encrypt.cryptPassword(vendorData.password);
    
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

        if(existingVendor.is_blocked){
            throw new Error('Account is blocked')
          }
        
        const role = 'vendor'
        const token = await generateToken(existingVendor.id , email,role)
        log("tokenvendor",token)
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
      },
      createPost: async(postData:{vendorId:string,description:string, image:Express.Multer.File}) => {
        try {
            const {Location} = await uploadToS3(postData.image);

            const newPost  = new Post({
                vendorId:postData.vendorId,
                description:postData.description,
                image:Location,
            })

            const savedPost = await newPost.save();

            return savedPost
        } catch (error) {
            console.error('Error in createPost:', error);
          throw error;
        }
      },

      
    
    
}