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
const vendorInteractor_1 = __importDefault(require("../../domain/usecases/auth/vendorInteractor"));
const console_1 = require("console");
const mongoVendorrepository_1 = require("../../infrastructure/repositories/mongoVendorrepository");
const serviceModel_1 = require("../../infrastructure/database/dbmodel/serviceModel");
const mongoPostRepository_1 = require("../../infrastructure/repositories/mongoPostRepository");
const vendorModel_1 = require("../../infrastructure/database/dbmodel/vendorModel");
const postModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/postModel"));
const eventBookingModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/eventBookingModel"));
const chatModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/chatModel"));
const MessageModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/MessageModel"));
const walletModel_1 = __importDefault(require("../../infrastructure/database/dbmodel/walletModel"));
exports.default = {
    vendorRegister: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, city, vendorType, password } = req.body;
            console.log(req.body, "vendorsign");
            const vendor = yield vendorInteractor_1.default.registerVendor(req.body);
            res.status(200).json({ message: 'Registration success', vendor });
        }
        catch (error) {
            console.log(error);
        }
    }),
    verifyOTP: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('otp', req.body);
        try {
            const response = yield vendorInteractor_1.default.verifyVendor(req.body);
            console.log("verifyOTP", response);
            res.status(200).json({ message: 'Verify Success', response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
            next(error);
        }
    }),
    vendorLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('logindata', req.body);
        try {
            const { email, password } = req.body;
            console.log(req.body);
            const response = yield vendorInteractor_1.default.loginVendor(email, password);
            res.status(200).json({ message: 'Login success', response });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: error.message });
        }
    }),
    licenseUpload: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { licenseNumber, email, issueDate, expiryDate } = req.body;
            const files = req.files;
            const licenseDocument = (_a = files === null || files === void 0 ? void 0 : files.licenseDocument) === null || _a === void 0 ? void 0 : _a[0];
            const logo = (_b = files === null || files === void 0 ? void 0 : files.logo) === null || _b === void 0 ? void 0 : _b[0];
            if (!licenseDocument) {
                console.error('License document is missing.');
                return res.status(400).json({ message: 'License document is required' });
            }
            if (!logo) {
                console.error('Logo is missing.');
                return res.status(400).json({ message: 'Logo is required' });
            }
            const licenseData = { licenseNumber, email, issueDate, expiryDate, licenseDocument, logo };
            const result = yield vendorInteractor_1.default.uploadVendorLicense(licenseData);
            res.status(200).json({ message: 'License and logo uploaded successfully', result });
        }
        catch (error) {
            console.error('Error in licenseUpload:', error);
            res.status(500).json({ message: 'Error uploading license and logo', error: error.message });
        }
    }),
    checkAuth: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Hellooooo");
    }),
    resendOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const response = yield vendorInteractor_1.default.resendOtp(email);
            res.status(200).json({ response });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }),
    getVendorById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const vendorId = req.params.id;
        try {
            const vendor = yield vendorModel_1.Vendor.findById(vendorId);
            console.log(vendor, "😯");
            if (!vendor) {
                return res.status(404).json({ message: 'Vendor not found' });
            }
            res.status(200).json(vendor);
        }
        catch (error) {
            console.error('Error fetching vendor:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    getServices: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Call received");
        try {
            const services = yield serviceModel_1.Service.find().distinct('name');
            console.log(services, "😂");
            res.status(200).json(services);
        }
        catch (err) {
            res.status(500).json({ error: 'Failed to fetch services' });
        }
    }),
    createPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        (0, console_1.log)('post ');
        try {
            const { description, vendorId } = req.body;
            (0, console_1.log)(req.body, 'post body');
            const files = req.files;
            const image = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
            if (!description || !image) {
                return res.status(400).json({ error: 'Description and image are required' });
            }
            console.log(req.body, image, 'posts');
            const postData = { vendorId, description, image };
            const savedPost = yield vendorInteractor_1.default.createPost(postData);
            return res.status(200).json({ messgae: 'post added successfully', post: savedPost });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to add post' });
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
    updateVendor: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { vendorId } = req.params;
        const { name, city, services } = req.body;
        console.log("reqbody", req.body);
        try {
            const updatedVendor = yield (0, mongoVendorrepository_1.updateVendor)(vendorId, { name, city, services });
            if (updatedVendor) {
                res.status(200).json({ message: 'Vendor profile updated successfully', vendor: updatedVendor });
            }
            else {
                res.status(404).json({ message: 'Vendor not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: `Failed to update the vendor: ${error.message}` });
        }
    }),
    deletePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { postId } = req.params;
            const posts = yield postModel_1.default.findByIdAndDelete(postId);
            res.status(200).json(posts);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete post' });
        }
    }),
    bookingDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { vendorId } = req.params;
        console.log(vendorId, "vendid");
        try {
            const bookings = yield eventBookingModel_1.default.find({ vendor: vendorId })
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
        const { id } = req.params;
        const { status } = req.body;
        console.log('id:', id);
        console.log('status:', status);
        try {
            const booking = yield eventBookingModel_1.default.findByIdAndUpdate(id, { status }, { new: true });
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            if (status === 'Rejected') {
                const userId = booking.user;
                const amount = booking.amount;
                const wallet = yield walletModel_1.default.findOne({ userId });
                if (!wallet) {
                    return res.status(404).json({ message: 'Wallet not found' });
                }
                wallet.balance += amount;
                wallet.transactions.push({
                    amount,
                    type: 'credit',
                    date: new Date(),
                    booking: booking._id,
                });
                yield wallet.save();
            }
            res.status(200).json(booking);
        }
        catch (error) {
            console.error('Error updating booking status:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getBookingDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { bookingId } = req.params;
        console.log(bookingId, "😒");
        try {
            const booking = yield eventBookingModel_1.default.findById(bookingId)
                .populate({
                path: 'user',
                select: 'name email'
            })
                .exec();
            console.log(booking, "💕");
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.status(200).json(booking);
        }
        catch (error) {
            console.error('Error fetching booking details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }),
    getVendorCount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('hiii');
        try {
            const vendorCounts = yield vendorModel_1.Vendor.countDocuments();
            ;
            console.log('Vendor count retrieved:', vendorCounts);
            res.json(vendorCounts);
        }
        catch (error) {
            console.error('Failed to fetch vendor count:', error);
            res.status(500).json({ message: 'Failed to fetch vendor count' });
        }
    }),
    getActiveChats: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { vendorId } = req.params;
            console.log(vendorId, 'vendoriddididid');
            const activeChats = yield chatModel_1.default.find({
                users: vendorId,
                is_accepted: 'accepted'
            }).populate('users', 'name').populate('latestMessage');
            console.log(activeChats, 'activeChats');
            res.status(200).json(activeChats);
        }
        catch (error) {
            console.error('Error fetching active chats:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }),
    getMessages: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId } = req.params;
        console.log(chatId, 'chatId');
        try {
            const messages = yield MessageModel_1.default.find({ chat: chatId })
                .populate('sender', 'name')
                .sort({ createdAt: 1 });
            res.json(messages);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching messages' });
        }
    })
};
