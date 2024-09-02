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
exports.userCount = exports.getServices = exports.getStatus = exports.googleUser = exports.getStoredOTP = exports.saveOtp = exports.verifyUserDb = exports.createUser = exports.checkExistingUser = exports.getUserbyEMail = void 0;
const userModel_1 = require("../database/dbmodel/userModel");
const otpModel_1 = __importDefault(require("../database/dbmodel/otpModel"));
const hashPassword_1 = require("../../domain/helper/hashPassword");
const serviceModel_1 = require("../database/dbmodel/serviceModel");
const getUserbyEMail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield userModel_1.Users.findOne({ email: email });
});
exports.getUserbyEMail = getUserbyEMail;
const checkExistingUser = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield userModel_1.Users.findOne({ $and: [{ email: email }, { name: name }] });
    return existingUser;
});
exports.checkExistingUser = checkExistingUser;
const createUser = (userData, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("saved user", userData);
    if (!userData.email || !userData.name) {
        throw new Error("Email and name are required");
    }
    const email = userData.email;
    const name = userData.name;
    const existingUser = yield (0, exports.checkExistingUser)(email, name);
    if (existingUser) {
        if (existingUser.is_verified === false) {
            return existingUser;
        }
        throw new Error('User already exist');
    }
    if (!userData.name || !userData.email || !userData.password) {
        throw new Error("Name, email, and password are required fields");
    }
    const newUser = new userModel_1.Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
    });
    return yield newUser.save();
});
exports.createUser = createUser;
const verifyUserDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield userModel_1.Users.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
    return userData;
});
exports.verifyUserDb = verifyUserDb;
const saveOtp = (email, otp, generatedAt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpForStore = new otpModel_1.default({ otp, email, generatedAt });
        return yield otpForStore.save();
    }
    catch (error) {
        console.error('Error saving OTP:', error);
        throw new Error('Error saving OTP');
    }
});
exports.saveOtp = saveOtp;
const getStoredOTP = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.findOne({ email: email }).sort({ createdAt: -1 }).limit(1); });
exports.getStoredOTP = getStoredOTP;
const googleUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userData.email || !userData.name) {
        throw new Error('Data undefined');
    }
    const existingUser = yield (0, exports.checkExistingUser)(userData.email, userData.name);
    if (existingUser) {
        return existingUser;
    }
    const generatepass = Math.random().toString(36).slice(-8);
    const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(generatepass);
    const newUser = new userModel_1.Users({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        is_google: true
    });
    return yield newUser.save();
});
exports.googleUser = googleUser;
const getStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.Users.findOne({ _id: id });
    console.log(user);
    return user;
});
exports.getStatus = getStatus;
const getServices = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield serviceModel_1.Service.find();
});
exports.getServices = getServices;
const userCount = () => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield userModel_1.Users.countDocuments();
    return userCount;
});
exports.userCount = userCount;
