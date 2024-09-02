"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hashPassword_1 = require("../../helper/hashPassword");
const mongoVendorrepository_1 = require("../../../infrastructure/repositories/mongoVendorrepository");
const mongoUserRepository_1 = require("../../../infrastructure/repositories/mongoUserRepository");
const emailUtils_1 = __importDefault(require("../../../utils/emailUtils"));
const otpUtils_1 = require("../../../utils/otpUtils");
const jwtHelper_1 = require("../../helper/jwtHelper");
const s3Uploader_1 = require("../../../utils/s3Uploader");
const console_1 = require("console");
const postModel_1 = __importDefault(require("../../../infrastructure/database/dbmodel/postModel"));
exports.default = {
    registerVendor: (vendorData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Vendor data:', vendorData);
        try {
            if (!vendorData.email || !vendorData.name || !vendorData.password) {
                throw new Error('Vendor data is incomplete');
            }
            const existingVendor = yield (0, mongoVendorrepository_1.getVendorbyEmail)(vendorData.email);
            console.log('Existing Vendor:', existingVendor);
            if (existingVendor) {
                if (existingVendor.is_verified) {
                    throw new Error('Vendor already exists');
                }
                if (!existingVendor.otp_verified) {
                    console.log('Generating OTP...');
                    const otp = (0, otpUtils_1.generateOTP)();
                    console.log('Generated OTP:', otp);
                    const generatedAt = Date.now();
                    console.log('Sending OTP email...');
                    yield (0, emailUtils_1.default)(vendorData.email, otp, vendorData.name);
                    console.log('Saving OTP...');
                    const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(vendorData.email, otp, generatedAt);
                    console.log('OTP saved successfully:', savedOtp);
                    return { message: 'OTP generated successfully', otpGenerated: true, redirectTo: '/vendor/otp-verification' };
                }
                else {
                    const getLicense = yield (0, mongoVendorrepository_1.getVendorLicense)(vendorData.email);
                    console.log('Vendor License:', getLicense);
                    if ((getLicense === null || getLicense === void 0 ? void 0 : getLicense.email) === vendorData.email) {
                        return { message: 'Your license is under verification. Please wait for approval.', redirectTo: '/vendor/success' };
                    }
                    console.log('Redirecting to license upload...');
                    return {
                        message: "Registration success",
                        redirectTo: "/vendor/uploadlicense"
                    };
                }
            }
            console.log('Generating OTP...');
            const otp = (0, otpUtils_1.generateOTP)();
            console.log('Generated OTP:', otp);
            const generatedAt = Date.now();
            console.log('Sending OTP email...');
            yield (0, emailUtils_1.default)(vendorData.email, otp, vendorData.name);
            console.log('Saving OTP...');
            const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(vendorData.email, otp, generatedAt);
            console.log('OTP saved successfully:', savedOtp);
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(vendorData.password);
            const savedVendor = yield (0, mongoVendorrepository_1.createVendor)(Object.assign({}, vendorData), hashedPassword);
            console.log('Saved Vendor:', savedVendor);
            return { message: 'Vendor registered successfully', vendor: savedVendor, redirectTo: '/vendor/otp-verification' };
        }
        catch (error) {
            console.error('Error during vendor registration:', error);
            throw new Error(error.message || 'Registration failed');
        }
    }),
    verifyVendor: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("body ", data);
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield (0, mongoUserRepository_1.getStoredOTP)(data.email);
        console.log("1111111111111", storedOTP);
        if (!storedOTP || storedOTP.otp !== data.otp) {
            console.log('invalid otp');
            throw new Error('Invalid Otp');
        }
        const otpGeneratedAt = storedOTP.generatedAt;
        const currentTime = Date.now();
        const otpAge = currentTime - otpGeneratedAt.getTime();
        const expireOTP = 1 * 60 * 1000;
        if (otpAge > expireOTP) {
            throw new Error('OTP Expired');
        }
        return yield (0, mongoVendorrepository_1.verifyVendorDb)(data.email);
    }),
    loginVendor: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingVendor = yield (0, mongoVendorrepository_1.getVendorbyEmail)(email);
        const vendors = yield (0, mongoVendorrepository_1.getVendor)(email);
        if (!existingVendor || !existingVendor.password) {
            throw new Error('User not found');
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingVendor.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        if (!vendors) {
            throw new Error('vendor is not found');
        }
        if (!existingVendor.is_verified) {
            throw new Error('Account is not verified');
        }
        if (existingVendor.is_blocked) {
            throw new Error('Account is blocked');
        }
        const role = 'vendor';
        const token = yield (0, jwtHelper_1.generateToken)(existingVendor.id, email, role);
        (0, console_1.log)("tokenvendor", token);
        const vendor = {
            id: existingVendor.id,
            name: existingVendor.name,
            email: existingVendor.email
        };
        return { token, vendor };
    }),
    uploadVendorLicense: (licenseData) => __awaiter(void 0, void 0, void 0, function* () {
        const { licenseNumber, email, issueDate, expiryDate, licenseDocument, logo } = licenseData;
        const licenseDocumentResult = yield (0, s3Uploader_1.uploadToS3)(licenseDocument);
        const licenseDocumentUrl = licenseDocumentResult.Location;
        const logoResult = yield (0, s3Uploader_1.uploadToS3)(logo);
        const logoUrl = logoResult.Location;
        const completeLicenseData = {
            licenseNumber,
            email,
            issueDate,
            expiryDate,
            licenseDocumentUrl,
            logoUrl,
        };
        const savedLicense = yield (0, mongoVendorrepository_1.saveLicense)(completeLicenseData);
        return savedLicense;
    }),
    resendOtp: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newOtp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const vendors = yield (0, mongoVendorrepository_1.getVendorbyEmail)(email);
            if (vendors && vendors.name) {
                yield (0, emailUtils_1.default)(email, newOtp, vendors.name);
                (0, console_1.log)('newOtp:', newOtp);
                yield (0, mongoUserRepository_1.saveOtp)(email, newOtp, generatedAt);
            }
            else {
                throw new Error('Please signup again');
            }
        }
        catch (error) {
            throw new Error('Failed to resend otp');
        }
    }),
    createPost: (postData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Location } = yield (0, s3Uploader_1.uploadToS3)(postData.image);
            const newPost = new postModel_1.default({
                vendorId: postData.vendorId,
                description: postData.description,
                image: Location,
            });
            const savedPost = yield newPost.save();
            return savedPost;
        }
        catch (error) {
            console.error('Error in createPost:', error);
            throw error;
        }
    }),
};
