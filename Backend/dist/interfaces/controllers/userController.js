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
const userInteractor_1 = __importDefault(require("../../domain/usecases/auth/userInteractor"));
const mongoVendorrepository_1 = require("../../infrastructure/repositories/mongoVendorrepository");
const mongoUserRepository_1 = require("../../infrastructure/repositories/mongoUserRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtHelper_1 = require("../../domain/helper/jwtHelper");
const licenceModel_1 = require("../../infrastructure/database/dbmodel/licenceModel");
const userModel_1 = require("../../infrastructure/database/dbmodel/userModel");
const vendorModel_1 = require("../../infrastructure/database/dbmodel/vendorModel");
const mongoPostRepository_1 = require("../../infrastructure/repositories/mongoPostRepository");
const mongoReviewRepository_1 = require("../../infrastructure/repositories/mongoReviewRepository");
const eventBookingModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/eventBookingModel"));
const mongoVendorrepository_2 = require("../../infrastructure/repositories/mongoVendorrepository");
const hashPassword_1 = require("../../domain/helper/hashPassword");
const mongoServiceRepository_1 = require("../../infrastructure/repositories/mongoServiceRepository");
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/chatModel"));
const MessageModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/MessageModel"));
const walletModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/walletModel"));
const serviceModel_1 = require("../../infrastructure/database/dbmodel/serviceModel");
exports.default = {
    userRegistration: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userInteractor_1.default.registerUser(req.body);
            res.status(200).json({ message: "registration success", user });
        }
        catch (error) {
            console.log(error);
            if (error.message === 'User already exist') {
                res.status(409).json({ message: error.message });
            }
            else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }),
    verifyOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.verifyUser(req.body);
            console.log("verifyOTP", response);
            res.status(200).json({ message: 'Verify Success', response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.body);
        try {
            const { email, password } = req.body;
            const response = yield userInteractor_1.default.loginUser(email, password);
            const { token, refreshToken } = response;
            res.cookie('usertoken', token, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.status(200).json({ message: 'Login success', response });
        }
        catch (error) {
            console.error("Controller error:", error.message);
            if (error.message === 'User is not verified') {
                res.status(403).json({ message: 'User is not verified' });
            }
            else {
                res.status(500).json({ message: error.message });
            }
        }
    }),
    googleAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userInteractor_1.default.googleUser(req.body);
            res.status(200).json({ message: 'Google auth success', response });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }),
    getStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const response = yield userInteractor_1.default.getStatus(id);
            res.status(200).json({ response });
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }),
    resendOTP: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const response = yield userInteractor_1.default.otpResend(email);
            res.status(200).json({ response });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    checkAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Hellooooo");
    }),
    getVendor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, mongoVendorrepository_1.getAllVendors)();
            res.status(200).json({ response });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    getServiceUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const categoryName = req.params.name;
        try {
            const response = yield (0, mongoUserRepository_1.getServices)();
            console.log(response, "imgurl");
            res.status(200).json({ response });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: "Refresh token not provided" });
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
            const user = yield (0, mongoUserRepository_1.getUserbyEMail)(decoded.email);
            const { token: newAccessToken, refreshToken: newRefreshToken } = (0, jwtHelper_1.generateToken)(user === null || user === void 0 ? void 0 : user.id, decoded.email, 'user');
            res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.json({ accessToken: newAccessToken });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
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
    getVendorDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const vendor = yield vendorModel_1.Vendor.findById(id);
            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error('Error fetching vendor:', error);
            res.status(500).json({ message: 'Error fetching vendor', error: error.message });
        }
    }),
    reportVendor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId, reason } = req.body;
            console.log(vendorId, reason, "viddd");
            yield userInteractor_1.default.reportVendor(vendorId, reason);
            return res.status(200).json({ message: 'Report submitted successfully' });
        }
        catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).json({ message: 'Error fetching report', error: error.message });
        }
    }),
    getPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.params;
            const posts = yield (0, mongoPostRepository_1.getPosts)(vendorId);
            res.status(200).json(posts);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get post' });
        }
    }),
    createReview: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId, userId, review, rating } = req.body;
            const reviewData = { vendorId, userId, review, rating };
            const reviews = yield userInteractor_1.default.createReview(reviewData);
            return res.status(200).json(reviews);
        }
        catch (error) {
            console.error('Error creating review and rating:', error);
            res.status(500).json({ message: 'Failed to submit review and rating' });
        }
    }),
    getReviews: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.query;
            const reviews = yield (0, mongoReviewRepository_1.getReviewsAndRatings)(vendorId);
            res.status(200).json(reviews);
        }
        catch (error) {
        }
    }),
    bookEvents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const bookingData = req.body;
            console.log(bookingData, "bookdata");
            const newBooking = yield userInteractor_1.default.addNewBooking(bookingData);
            console.log(newBooking, "newbook");
            res.status(201).json(newBooking);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    checkAvailability: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { date, vendorId } = req.body;
            const available = yield userInteractor_1.default.checkBookingAvailability(date, vendorId);
            res.status(200).json({ available });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    getBookings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, vendorId } = req.query;
            const bookings = yield eventBookingModel_1.default.find({ user: userId, vendor: vendorId });
            res.json(bookings);
        }
        catch (error) {
            console.error('Failed to fetch bookings', error);
            res.status(500).json({ message: 'Failed to fetch bookings' });
        }
    }),
    //new:
    getVendors: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { service, city } = req.query;
            console.log(`service: ${service} city: ${city}`);
            const query = { is_verified: true, is_blocked: false };
            if (service) {
                query.services = { $elemMatch: { name: service } };
            }
            if (city) {
                query.city = city;
            }
            let vendors;
            if (!service && !city) {
                const result = yield (0, mongoVendorrepository_2.getVendorsWithService)();
                vendors = result.vendors;
                console.log(vendors, "All vendors with services");
            }
            else {
                vendors = yield vendorModel_1.Vendor.find(query, {
                    _id: 1, name: 1, email: 1, city: 1, services: 1, is_blocked: 1
                }).lean();
                console.log(vendors, "Filtered vendors");
            }
            const serviceNames = [...new Set(vendors.flatMap(vendor => vendor.services.map(service => service.name)))];
            const serviceImages = yield (0, mongoServiceRepository_1.getServiceImages)(serviceNames);
            const serviceImagesMap = new Map(serviceImages.map(img => [img.name, img.imageUrl]));
            const vendorsWithImages = vendors.map(vendor => (Object.assign(Object.assign({}, vendor), { services: vendor.services.map(service => (Object.assign(Object.assign({}, service), { imageUrl: serviceImagesMap.get(service.name) || '' }))) })));
            res.status(200).json(vendorsWithImages);
        }
        catch (error) {
            console.error('Failed to fetch vendors', error);
            res.status(500).json({ message: 'Failed to fetch vendors' });
        }
    }),
    updateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name } = req.body;
        const { userId } = req.params;
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.name = name || user.name;
            const updatedUser = yield user.save();
            console.log(updatedUser, 'upuser');
            res.status(200).json(updatedUser);
        }
        catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Failed to update user' });
        }
    }),
    bookingDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.params;
        console.log(userId, "userIddddddddd");
        try {
            const bookings = yield eventBookingModel_1.default.find({ user: userId })
                .populate('user')
                .populate('vendor')
                .sort({ _id: -1 });
            console.log(bookings, "bookings");
            res.json(bookings);
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    updateBookingStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { bookingId } = req.params;
        const { status } = req.body;
        try {
            const booking = yield eventBookingModel_1.default.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            booking.status = status;
            yield booking.save();
            if (status === 'Cancelled') {
                const userId = booking.user.toString();
                const amount = booking.payment.amount;
                const eventDate = new Date(booking.date);
                const currentDate = new Date();
                let refundAmount = 0;
                const weeksBeforeEvent = (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 7);
                if (weeksBeforeEvent >= 2 && weeksBeforeEvent < 3) {
                    refundAmount = amount * 0.30;
                }
                else if (weeksBeforeEvent >= 3) {
                    refundAmount = amount * 0.50;
                }
                if (refundAmount > 0) {
                    let wallet = yield walletModel_1.default.findOne({ userId });
                    if (!wallet) {
                        wallet = new walletModel_1.default({
                            userId,
                            balance: refundAmount,
                            transactions: [{
                                    amount: refundAmount,
                                    type: 'credit',
                                    date: new Date(),
                                    booking: booking._id,
                                }],
                        });
                        yield wallet.save();
                        console.log('wall', wallet);
                    }
                    else {
                        wallet.balance += refundAmount;
                        wallet.transactions.push({
                            amount: refundAmount,
                            type: 'credit',
                            date: new Date(),
                            booking: booking._id,
                        });
                        yield wallet.save();
                    }
                }
            }
            res.status(200).json(booking);
        }
        catch (error) {
            console.error('Error updating booking status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    changePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentPassword, newPassword, userId } = req.body;
        console.log(currentPassword, newPassword, userId);
        try {
            const user = yield userModel_1.Users.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.password) {
                return res.status(400).json({ message: 'User password not set' });
            }
            const isMatch = yield hashPassword_1.Encrypt.comparePassword(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword = yield hashPassword_1.Encrypt.cryptPassword(newPassword);
            user.password = hashedPassword;
            yield user.save();
            res.status(200).json({ message: 'Password updated successfully' });
        }
        catch (error) {
        }
    }),
    getUserCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userCounts = yield (0, mongoUserRepository_1.userCount)();
            res.json(userCounts);
        }
        catch (error) {
            console.error('Failed to fetch bookings', error);
            res.status(500).json({ message: 'Failed to fetch bookings' });
        }
    }),
    chatRoomExist: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = req.body;
        console.log(userId);
    }),
    getActiveChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        try {
            const chats = yield chatModel_1.default.find({
                users: userId,
                is_accepted: 'accepted'
            })
                .populate({
                path: 'users',
                model: 'User',
                select: 'name',
                match: { _id: { $ne: userId } }
            })
                .populate({
                path: 'users',
                model: 'Vendor',
                select: 'name'
            })
                .exec();
            res.json(chats);
        }
        catch (error) {
            console.error('Error fetching active chats:', error);
            if (!res.headersSent) {
                res.status(500).send('Server error');
            }
        }
    }),
    getMessagesByRoomId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.roomId;
        console.log(roomId, 'rmid');
        try {
            const chat = yield chatModel_1.default.findById(roomId)
                .populate('users', 'name')
                .populate({
                path: 'users',
                match: { _id: { $ne: req.params.userId } },
                select: 'name'
            })
                .exec();
            if (!chat) {
                return res.status(404).json({ message: 'Chat not found' });
            }
            const messages = yield MessageModel_1.default.find({ chat: roomId })
                .populate('sender', 'name')
                .exec();
            const vendors = yield vendorModel_1.Vendor.find({ _id: { $in: chat.users } });
            res.json({
                chat,
                messages,
                vendors
            });
        }
        catch (error) {
            console.error('Error fetching chat and messages:', error);
            if (!res.headersSent) {
                res.status(500).send('Server error');
            }
        }
    }),
    getWallets: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId } = req.params;
            console.log(userId, "Received userId");
            const walletData = yield walletModel_1.default.findOne({ userId })
                .populate({
                path: 'transactions.booking',
                model: 'Booking',
                select: 'event_name vendor_name'
            });
            console.log('walletData:', walletData);
            if (!walletData) {
                return res.status(404).json({ message: 'Wallet not found' });
            }
            res.json(walletData);
        }
        catch (error) {
            console.error('Error fetching wallet data:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }),
    getAllBookings: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const booking = yield eventBookingModel_1.default.find();
            res.status(200).json(booking);
        }
        catch (error) {
            console.error('Error fetching bookings:', error);
            res.status(500).json({ message: 'Internal serevr error' });
        }
    }),
    getAllServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield serviceModel_1.Service.find({ is_active: true });
            res.status(200).json(services);
        }
        catch (error) {
            console.error('Error fetching services:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    })
};
