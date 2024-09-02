"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const express_1 = require("express");
const vendorController_1 = __importDefault(require("../controllers/vendorController"));
const multer_1 = __importDefault(require("multer"));
const vendorAuthMiddleware_1 = require("../frameworks/webserver/middleware/vendorAuthMiddleware");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
}).fields([
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);
exports.upload = upload;
const vendorRouter = (0, express_1.Router)();
vendorRouter.post('/signup', vendorController_1.default.vendorRegister);
vendorRouter.post('/otp-vendor', vendorController_1.default.verifyOTP);
vendorRouter.post('/resend-otp', vendorController_1.default.resendOtp);
vendorRouter.post('/login', vendorController_1.default.vendorLogin);
vendorRouter.get('/count', vendorController_1.default.getVendorCount);
vendorRouter.post('/uploadlicense', upload, vendorController_1.default.licenseUpload);
vendorRouter.post('/checkAuth', vendorAuthMiddleware_1.protectVendor, vendorController_1.default.checkAuth);
vendorRouter.get('/service-types', vendorController_1.default.getServices);
vendorRouter.get('/:id', vendorController_1.default.getVendorById);
vendorRouter.post('/posts', upload, vendorController_1.default.createPost);
vendorRouter.get('/getposts/:vendorId', vendorController_1.default.getPosts);
vendorRouter.put('/:vendorId', vendorController_1.default.updateVendor);
vendorRouter.delete('/deleteposts/:postId', vendorController_1.default.deletePost);
vendorRouter.get('/bookings/:vendorId', vendorController_1.default.bookingDetails);
vendorRouter.patch('/booking/:id', vendorController_1.default.updateBookingStatus);
vendorRouter.get('/bookingdetails/:bookingId', vendorController_1.default.getBookingDetails);
vendorRouter.get('/active-chats/:vendorId', vendorController_1.default.getActiveChats);
vendorRouter.get('/messages/:chatId', vendorController_1.default.getMessages);
exports.default = vendorRouter;
