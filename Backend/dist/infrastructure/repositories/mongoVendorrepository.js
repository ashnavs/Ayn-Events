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
exports.vendorCount = exports.updateVendor = exports.getVendorsWithService = exports.getAllVendors = exports.getVendorLicense = exports.saveLicense = exports.verifyVendor = exports.getVendor = exports.getVendorbyEmail = exports.verifyVendorDb = exports.createVendor = void 0;
const vendorModel_1 = require("../database/dbmodel/vendorModel");
const licenceModel_1 = require("../database/dbmodel/licenceModel");
const serviceModel_1 = require("../database/dbmodel/serviceModel");
const console_1 = require("console");
const createVendor = (vendorData, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('vendorData:', vendorData);
    const formattedServices = vendorData.services.map(service => {
        if (typeof service === 'string') {
            return { name: service, price: 0 };
        }
        else {
            return service;
        }
    });
    const newVendor = new vendorModel_1.Vendor({
        name: vendorData.name,
        email: vendorData.email,
        password: hashedPassword,
        city: vendorData.city,
        services: formattedServices,
        is_verified: false
    });
    console.log('newVendor:', newVendor);
    return yield newVendor.save();
});
exports.createVendor = createVendor;
const verifyVendorDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorData = yield vendorModel_1.Vendor.findOneAndUpdate({ email: email }, { $set: { otp_verified: true } }, { new: true });
    return vendorData;
});
exports.verifyVendorDb = verifyVendorDb;
const getVendorbyEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOne({ email: email });
});
exports.getVendorbyEmail = getVendorbyEmail;
const getVendor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOne({ email: email });
});
exports.getVendor = getVendor;
const verifyVendor = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vendorModel_1.Vendor.findOneAndUpdate({ email: email }, { $set: { is_verified: true } }, { new: true });
});
exports.verifyVendor = verifyVendor;
const saveLicense = (licenseData) => __awaiter(void 0, void 0, void 0, function* () {
    const license = new licenceModel_1.LicenseModel(licenseData);
    return yield license.save();
});
exports.saveLicense = saveLicense;
const getVendorLicense = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield licenceModel_1.LicenseModel.findOne({ email: email });
});
exports.getVendorLicense = getVendorLicense;
const getAllVendors = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('got vendor');
    return yield vendorModel_1.Vendor.find({ is_verified: true, is_blocked: false }, { _id: 1, name: 1, email: 1, city: 1, service: 1, is_blocked: 1 });
});
exports.getAllVendors = getAllVendors;
//new:
const getVendorsWithService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield vendorModel_1.Vendor.find({
            is_verified: true,
            is_blocked: false
        }, {
            _id: 1,
            name: 1,
            email: 1,
            city: 1,
            services: 1 // Ensure you are fetching the correct field name
        }).lean();
        console.log("Fetched vendors:", vendors);
        // Extract unique service names
        const services = [];
        vendors.forEach((vendor) => {
            if (vendor.services) {
                vendor.services.forEach((service) => {
                    if (service && !services.includes(service.name)) {
                        services.push(service.name);
                    }
                });
            }
        });
        console.log("Extracted services:", services);
        const matchingServices = yield serviceModel_1.Service.find({ name: { $in: services } }).lean();
        (0, console_1.log)("matchingServices1", matchingServices);
        return { vendors, matchingServices };
    }
    catch (error) {
        console.error("Error fetching vendors and services:", error);
        throw error;
    }
});
exports.getVendorsWithService = getVendorsWithService;
const updateVendor = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id, "😤😤😤");
    try {
        console.log("😤😤😤");
        const updatedVendor = yield vendorModel_1.Vendor.findByIdAndUpdate(id, data, { new: true }).exec();
        console.log(updatedVendor, "😤😤😤");
        return updatedVendor;
    }
    catch (error) {
        throw new Error(`Failed to update vendor: ${error.message}`);
    }
});
exports.updateVendor = updateVendor;
const vendorCount = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorCount = yield vendorModel_1.Vendor.countDocuments();
        console.log(vendorCount, "vendorcounts");
        return vendorCount;
    }
    catch (error) {
        throw new Error(`Failed to get vendor count: ${error.message}`);
    }
});
exports.vendorCount = vendorCount;
