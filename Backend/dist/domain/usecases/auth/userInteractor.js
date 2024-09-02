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
const mongoUserRepository_1 = require("../../../infrastructure/repositories/mongoUserRepository");
const hashPassword_1 = require("../../helper/hashPassword");
const otpUtils_1 = require("../../../utils/otpUtils");
const emailUtils_1 = __importDefault(require("../../../utils/emailUtils"));
const mongoUserRepository_2 = require("../../../infrastructure/repositories/mongoUserRepository");
const jwtHelper_1 = require("../../helper/jwtHelper");
const mongoVendorrepository_1 = require("../../../infrastructure/repositories/mongoVendorrepository");
const mongoReportRepository_1 = require("../../../infrastructure/repositories/mongoReportRepository");
const console_1 = require("console");
const mongoReviewRepository_1 = require("../../../infrastructure/repositories/mongoReviewRepository");
const mongoBookingRepository_1 = require("../../../infrastructure/repositories/mongoBookingRepository");
function createError(message, status) {
    const error = new Error(message);
    error.status = status;
    return error;
}
exports.default = {
    registerUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("userdata usecase", userData);
        try {
            if (!userData.email || !userData.name) {
                throw new Error("user data undefined");
            }
            const existingUser = yield (0, mongoUserRepository_1.checkExistingUser)(userData.email, userData.name);
            if (existingUser && existingUser.is_verified == true) {
                throw new Error('User already exist');
            }
            const otp = yield (0, otpUtils_1.generateOTP)();
            console.log("otpppppppp", otp);
            const generatedAt = Date.now();
            yield (0, emailUtils_1.default)(userData.email, otp, userData.name);
            const savedOtp = yield (0, mongoUserRepository_1.saveOtp)(userData.email, otp, generatedAt);
            const password = userData.password;
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(password);
            const savedUser = yield (0, mongoUserRepository_1.createUser)(userData, hashedPassword);
            console.log(savedUser);
            return savedUser;
        }
        catch (error) {
            throw error;
        }
    }),
    verifyUser: (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("body ", data);
        if (!data.otp) {
            throw new Error("no otp");
        }
        const storedOTP = yield (0, mongoUserRepository_2.getStoredOTP)(data.email);
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
        return yield (0, mongoUserRepository_1.verifyUserDb)(data.email);
    }),
    loginUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
        if (!existingUser || !existingUser.password) {
            throw new Error('User not found');
        }
        const isValid = yield hashPassword_1.Encrypt.comparePassword(password, existingUser.password);
        if (!isValid) {
            throw new Error("Invalid password");
        }
        if (existingUser && existingUser.is_blocked) {
            throw new Error('Account is Blocked');
        }
        if (existingUser.is_verified == false) {
            throw new Error(`User is not verified.Register!`);
        }
        const role = 'user';
        const { token, refreshToken } = yield (0, jwtHelper_1.generateToken)(existingUser.id, email, role);
        const user = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            isBlocked: existingUser.is_blocked
        };
        return { token, user, refreshToken };
    }),
    googleUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedUser = yield (0, mongoUserRepository_1.googleUser)(userData);
            console.log("saveduser:", savedUser);
            if (savedUser) {
                const user = {
                    id: savedUser._id,
                    name: savedUser.name,
                    email: savedUser.email
                };
                console.log("User Object:", user);
                if (!savedUser._id || !savedUser.email) {
                    throw new Error("User ID or email is undefined");
                }
                if (savedUser.is_blocked) {
                    throw createError('Account is Blocked', 403); // Forbidden
                }
                const role = 'user';
                let { token, refreshToken } = (0, jwtHelper_1.generateToken)(savedUser.id, savedUser.email, role);
                (0, console_1.log)(token, refreshToken, "refresh");
                return { user, token, refreshToken };
            }
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }),
    getStatus: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoUserRepository_1.getStatus)(id);
        }
        catch (error) {
            console.error(error.message);
            throw error;
        }
    }),
    otpResend: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newotp = yield (0, otpUtils_1.generateOTP)();
            const generatedAt = Date.now();
            const users = yield (0, mongoUserRepository_1.getUserbyEMail)(email);
            if (users && users.name) {
                yield (0, emailUtils_1.default)(email, newotp, users.name);
                console.log('newOtp:', newotp);
                yield (0, mongoUserRepository_1.saveOtp)(email, newotp, generatedAt);
            }
            else {
                throw new Error('Please signup again');
            }
        }
        catch (error) {
            throw new Error('Failed to resend otp');
        }
    }),
    getVendor: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, mongoVendorrepository_1.getVendor)(id);
        }
        catch (error) {
            throw new Error('Failed to get vendor');
        }
    }),
    reportVendor: (vendorId, reason) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const report = yield (0, mongoReportRepository_1.createReport)(vendorId, reason);
            console.log(report, "rrrr");
            return report;
        }
        catch (error) {
            console.error('Error in user interactor:', error);
            throw new Error('Error processing report');
        }
    }),
    createReview: (reviewData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reviews = yield (0, mongoReviewRepository_1.createReview)(reviewData);
            return reviews;
        }
        catch (error) {
            console.error('Error in user interactor:', error);
            throw new Error('Error processing review');
        }
    }),
    checkBookingAvailability: (date, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
        const existingBooking = yield (0, mongoBookingRepository_1.checkAvailabilityByDate)(date, vendorId);
        return !existingBooking;
    }),
    addNewBooking: (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newBooking = yield (0, mongoBookingRepository_1.saveBooking)(bookingData);
            console.log('Booking added:', newBooking);
            return newBooking;
        }
        catch (error) {
            console.error('Error adding booking:', error);
            throw new Error('Error adding booking');
        }
    }),
};
