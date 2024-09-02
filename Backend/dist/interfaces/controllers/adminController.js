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
const adminInteractor_1 = __importDefault(require("../../domain/usecases/auth/adminInteractor"));
const vendorModel_1 = require("../../infrastructure/database/dbmodel/vendorModel");
const licenceModel_1 = require("../../infrastructure/database/dbmodel/licenceModel");
const console_1 = require("console");
const mongoVendorrepository_1 = require("../../infrastructure/repositories/mongoVendorrepository");
const mongoAdminRepository_1 = require("../../infrastructure/repositories/mongoAdminRepository");
const mongoReportRepository_1 = require("../../infrastructure/repositories/mongoReportRepository");
const reportModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/reportModel"));
exports.default = {
    adminLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { email, password } = req.body;
            if (!email && !password) {
                throw new Error("user credentials not there");
            }
            const credentials = {
                email, password
            };
            console.log(credentials);
            const response = yield adminInteractor_1.default.loginAdmin(credentials);
            console.log(response);
            res.status(200).json({ message: 'Login success', response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 10 } = req.query;
            const users = yield adminInteractor_1.default.getUsers(Number(page), Number(limit));
            res.status(200).json(users);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    blockUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            const { is_blocked } = req.body;
            console.log('Request Params:', req.params);
            console.log('Request Body:', req.body);
            const updatedUser = yield adminInteractor_1.default.updatedUserStatus(userId, is_blocked);
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    getVendors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 20 } = req.query;
            const vendors = yield adminInteractor_1.default.getVendors(Number(page), Number(limit));
            res.status(200).json(vendors);
        }
        catch (error) {
            console.error('Error fetching vendors:', error);
            res.status(500).json({ error: 'Failed to fetch vendors' });
        }
    }),
    getVendorById: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const vendor = yield adminInteractor_1.default.fetchVendorById(req.params.id);
            if (!vendor)
                return res.status(404).json({ message: 'Vendor not found' });
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    updateVendorVerificationStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { is_verified } = req.body;
            const vendor = yield adminInteractor_1.default.verifyVendor(req.params.id, is_verified);
            if (!vendor)
                return res.status(404).json({ message: 'Vendor not found' });
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    updateIsVerified: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vendorId = req.params.vendorId;
        const { is_verified } = req.body;
        try {
            const updatedVendor = yield vendorModel_1.Vendor.findByIdAndUpdate(vendorId, { is_verified }, { new: true });
            res.json(updatedVendor);
        }
        catch (err) {
            console.error('Error updating vendor is_verified:', err);
            res.status(500).json({ error: 'Failed to update vendor is_verified' });
        }
    }),
    getLicenseByVendorEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.params;
        try {
            const license = yield licenceModel_1.LicenseModel.findOne({ email }).exec();
            if (!license) {
                return res.status(404).json({ message: 'License not found' });
            }
            res.status(200).json(license);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching license', error: error.message });
        }
    }),
    getVerifiedVendors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, mongoVendorrepository_1.getAllVendors)();
            (0, console_1.log)(response);
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    blockVendor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.params;
            const { is_blocked } = req.body;
            const updatedVendor = yield adminInteractor_1.default.updatedVendorStatus(vendorId, is_blocked);
            (0, console_1.log)('protectaDMIN CALLED');
            (0, console_1.log)(updatedVendor, 'upppppp');
            res.status(200).json(updatedVendor);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    addService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('🤦‍♀️');
            const { name } = req.body;
            const image = req.file;
            if (!image) {
                return res.status(400).json({ error: 'Image file is required' });
            }
            const serviceData = { name, image };
            yield adminInteractor_1.default.addService(serviceData);
            return res.status(200).json({ message: 'Service added successfully' });
        }
        catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Failed to add service' });
        }
    }),
    getServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { page = 1, limit = 5 } = req.query;
            const services = yield (0, mongoAdminRepository_1.getServices)(Number(page), Number(limit));
            res.status(200).json(services);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch services' });
        }
    }),
    blockService: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { serviceId } = req.params;
            const { is_active } = req.body;
            const updatedService = yield adminInteractor_1.default.updatedServiceStatus(serviceId, is_active);
            res.status(200).json(updatedService);
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    getReportCounts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const reportCounts = yield (0, mongoReportRepository_1.countReportsByVendor)();
            (0, console_1.log)(reportCounts, 'rpcount');
            return res.status(200).json(reportCounts);
        }
        catch (error) {
            console.error('Error getting report counts:', error);
            res.status(500).json({ message: 'Error getting report counts', error: error.message });
        }
    }),
    reportDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        (0, console_1.log)('Report details call');
        try {
            const { id } = req.params;
            const report = yield reportModel_1.default.find({ vendorId: id }).populate('vendorId', 'name');
            (0, console_1.log)(report, 'Report details');
            if (!report) {
                return res.status(404).json({ message: 'Report not found' });
            }
            console.log(report, 'Report details');
            res.status(200).json(report);
        }
        catch (error) {
            res.status(500).json({ message: 'Error getting report details', error: error.message });
        }
    })
};
