"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const userAuthMiddleware_1 = require("../frameworks/webserver/middleware/userAuthMiddleware");
const vendorController_1 = __importDefault(require("../controllers/vendorController"));
const chatController_1 = __importDefault(require("../controllers/chatController"));
const favoritesController_1 = __importDefault(require("../controllers/favoritesController"));
const userRouter = (0, express_1.Router)();
userRouter.post('/signup', userController_1.default.userRegistration);
userRouter.post('/otp-verification', userController_1.default.verifyOTP);
userRouter.post('/resend-otp', userController_1.default.resendOTP);
userRouter.post('/login', userController_1.default.userLogin);
userRouter.post('/googleAuth', userController_1.default.googleAuth);
userRouter.get('/getStatus', userController_1.default.getStatus);
userRouter.get('/license/:email', userAuthMiddleware_1.protectUser, userController_1.default.getLicenseByVendorEmail);
userRouter.post('/checkAuth', userAuthMiddleware_1.protectUser, userController_1.default.checkAuth);
userRouter.get('/verifyvendor', userController_1.default.getVendor);
userRouter.get('/category', userAuthMiddleware_1.protectUser, userController_1.default.getServiceUser);
userRouter.post('/refreshtoken', userController_1.default.refreshToken);
userRouter.get('/vendorDetails/:id', userController_1.default.getVendorDetails);
userRouter.post('/report', userController_1.default.reportVendor);
userRouter.get('/getposts/:vendorId', userController_1.default.getPosts);
userRouter.post('/reviews', userController_1.default.createReview);
userRouter.get('/getreviews', userController_1.default.getReviews);
userRouter.post('/booking', userController_1.default.bookEvents);
userRouter.post('/checkAvailability', userController_1.default.checkAvailability);
userRouter.get('/bookings', userController_1.default.getBookings);
userRouter.get('/vendors', userController_1.default.getVendors);
userRouter.put('/updateuser/:userId', userController_1.default.updateUser);
userRouter.get('/booking/:userId', userController_1.default.bookingDetails);
userRouter.patch('/bookings/:bookingId/cancel', userController_1.default.updateBookingStatus);
userRouter.put('/change-password', userController_1.default.changePassword);
userRouter.get('/count', userController_1.default.getUserCount);
userRouter.get('/bookingdetails/:bookingId', vendorController_1.default.getBookingDetails);
userRouter.patch('/:roomId/accept', chatController_1.default.acceptChatRequest);
userRouter.get('/active-chats/:userId', userController_1.default.getActiveChats);
userRouter.get('/messages/:roomId', userController_1.default.getMessagesByRoomId);
userRouter.get('/rooms/:roomId', userController_1.default.getMessagesByRoomId);
userRouter.get('/wallet/:userId', userController_1.default.getWallets);
userRouter.get('/favorites/:userId', favoritesController_1.default.getFavorites);
userRouter.get('/allbookings', userController_1.default.getAllBookings);
userRouter.get('/get-services', userController_1.default.getAllServices);
exports.default = userRouter;
