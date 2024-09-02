"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController"));
const multer_1 = __importDefault(require("multer"));
const adminAuthMiddleware_1 = require("../frameworks/webserver/middleware/adminAuthMiddleware");
const adminRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).single('image');
adminRouter.post('/login', adminController_1.default.adminLogin);
adminRouter.get('/userlist', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getUsers);
adminRouter.get('/users', adminController_1.default.getUsers);
adminRouter.patch('/blockUser/:userId', adminController_1.default.blockUser);
adminRouter.get('/verifyvendor', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVendors);
adminRouter.get('/vendor/:id', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVendorById);
adminRouter.get('/license/:email', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getLicenseByVendorEmail);
adminRouter.patch('/updatestatus/:id', adminAuthMiddleware_1.protectAdmin, adminController_1.default.updateVendorVerificationStatus);
adminRouter.patch('/updateisverified/:vendorId', adminAuthMiddleware_1.protectAdmin, adminController_1.default.updateIsVerified);
adminRouter.get('/vendorlist', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getVerifiedVendors);
adminRouter.patch('/blockVendor/:vendorId', adminAuthMiddleware_1.protectAdmin, adminController_1.default.blockVendor);
adminRouter.post('/addservice', adminAuthMiddleware_1.protectAdmin, upload, adminController_1.default.addService);
adminRouter.get('/get-services', adminAuthMiddleware_1.protectAdmin, adminController_1.default.getServices);
adminRouter.patch('/blockService/:serviceId', adminAuthMiddleware_1.protectAdmin, adminController_1.default.blockService);
adminRouter.get('/reportlist', adminController_1.default.getReportCounts);
adminRouter.get('/reports/:id', adminController_1.default.reportDetails);
exports.default = adminRouter;
