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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoAdminRepository_1 = require("../../../infrastructure/repositories/mongoAdminRepository");
const mongoAdminRepository_2 = require("../../../infrastructure/repositories/mongoAdminRepository");
const jwtHelper_1 = require("../../helper/jwtHelper");
const s3Uploader_1 = require("../../../utils/s3Uploader");
const serviceModel_1 = require("../../../infrastructure/database/dbmodel/serviceModel");
exports.default = {
    loginAdmin: (cred) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const admin = yield (0, mongoAdminRepository_1.findAdmin)(cred.email);
            if (!admin) {
                throw new Error('Admin not found');
            }
            if (cred.password !== admin.password) {
                throw new Error('Incorrect password');
            }
            const role = 'admin';
            const token = yield (0, jwtHelper_1.generateToken)(admin.id, cred.email, role);
            return { admin, token };
        }
        catch (error) {
            console.error(`Error: ${error.message}`);
            throw error;
        }
    }),
    userList: () => __awaiter(void 0, void 0, void 0, function* () {
        const users = (0, mongoAdminRepository_2.getAllUsers)();
        return users;
    }),
    getUsers: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield (0, mongoAdminRepository_2.getPaginatedUsers)(page, limit);
            return users;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    updatedUserStatus: (userId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield (0, mongoAdminRepository_2.updateUserStatus)(userId, is_blocked);
            return updatedUser;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    getVendors: (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendors = yield (0, mongoAdminRepository_2.getPaginatedVendors)(page, limit);
            return vendors;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    fetchVendorById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield (0, mongoAdminRepository_2.getVendorById)(id);
            return vendor;
        }
        catch (error) {
            console.error('Error fetching vendor by id:', error);
            throw new Error('Failed to fetch vendor');
        }
    }),
    verifyVendor: (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updated = yield (0, mongoAdminRepository_2.updateVendorVerificationStatus)(id, is_verified);
            return updated;
        }
        catch (error) {
            console.error('Error verifying vendor:', error);
            throw new Error('Failed to verify vendor');
        }
    }),
    updatedVendorStatus: (vendorId, is_blocked) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedVendor = yield (0, mongoAdminRepository_2.updateVendorStatus)(vendorId, is_blocked);
            return updatedVendor;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    addService: (serviceData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Location } = yield (0, s3Uploader_1.uploadToS3)(serviceData.image);
            const newService = new serviceModel_1.Service({
                name: serviceData.name,
                imageUrl: Location
            });
            const savedService = yield newService.save();
            return savedService;
        }
        catch (error) {
            console.error('Error in addService:', error);
            throw error;
        }
    }),
    updatedServiceStatus: (serviceId, is_active) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedService = yield (0, mongoAdminRepository_2.updateServiceStatus)(serviceId, is_active);
            return updatedService;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
};
