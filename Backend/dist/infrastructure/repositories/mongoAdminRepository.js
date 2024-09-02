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
exports.updateServiceStatus = exports.getServiceName = exports.getServices = exports.updateVendorStatus = exports.updateVendorVerificationStatus = exports.getVendorById = exports.getUnverifiedVendors = exports.getPaginatedVendors = exports.updateUserStatus = exports.getPaginatedUsers = exports.getAllUsers = exports.findAdmin = void 0;
const adminModel_1 = require("../database/dbmodel/adminModel");
const userModel_1 = require("../database/dbmodel/userModel");
const vendorModel_1 = require("../database/dbmodel/vendorModel");
const serviceModel_1 = require("../database/dbmodel/serviceModel");
const console_1 = require("console");
const findAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield adminModel_1.Admin.findOne({ email });
});
exports.findAdmin = findAdmin;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield userModel_1.Users.find();
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getAllUsers = getAllUsers;
const getPaginatedUsers = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.Users.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalUsers = yield userModel_1.Users.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        return {
            users,
            totalPages,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getPaginatedUsers = getPaginatedUsers;
const updateUserStatus = (userId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield userModel_1.Users.findByIdAndUpdate(userId, { is_blocked: isBlocked }, { new: true });
        return updatedUser;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateUserStatus = updateUserStatus;
const getPaginatedVendors = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendorModel_1.Vendor.find({ is_verified: false })
            .skip((page - 1) * limit)
            .limit(limit);
        const totalVendors = yield vendorModel_1.Vendor.countDocuments();
        const totalPages = Math.ceil(totalVendors / limit);
        return {
            vendors,
            totalPages,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getPaginatedVendors = getPaginatedVendors;
const getUnverifiedVendors = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendorModel_1.Vendor.find({ is_verified: false })
        .skip((page - 1) * limit)
        .limit(limit);
    const totalVendors = yield vendorModel_1.Vendor.countDocuments();
    return {
        vendors,
        totalPages: Math.ceil(totalVendors / limit),
    };
});
exports.getUnverifiedVendors = getUnverifiedVendors;
const getVendorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findById(id);
});
exports.getVendorById = getVendorById;
const updateVendorVerificationStatus = (id, is_verified) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findByIdAndUpdate(id, { is_verified: true }, { new: true });
});
exports.updateVendorVerificationStatus = updateVendorVerificationStatus;
const updateVendorStatus = (vendorId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedVndor = yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, { is_blocked: isBlocked }, { new: true });
        (0, console_1.log)(updatedVndor, 'upvendor');
        return updatedVndor;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateVendorStatus = updateVendorStatus;
const getServices = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield serviceModel_1.Service.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalServices = yield serviceModel_1.Service.countDocuments();
        const totalPages = Math.ceil(totalServices / limit);
        return {
            services,
            totalPages,
        };
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getServices = getServices;
const getServiceName = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield serviceModel_1.Service.find({ name: 1 });
});
exports.getServiceName = getServiceName;
const updateServiceStatus = (serviceId, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedService = yield serviceModel_1.Service.findByIdAndUpdate(serviceId, { is_active: !isBlocked }, { new: true });
        return updatedService;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.updateServiceStatus = updateServiceStatus;
