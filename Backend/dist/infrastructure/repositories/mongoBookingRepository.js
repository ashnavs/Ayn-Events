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
exports.saveBooking = exports.checkAvailabilityByDate = void 0;
const eventBookingModel_1 = __importDefault(require("../database/dbmodel/eventBookingModel"));
const checkAvailabilityByDate = (date, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield eventBookingModel_1.default.findOne({ date, vendor: vendorId });
    return booking;
});
exports.checkAvailabilityByDate = checkAvailabilityByDate;
const saveBooking = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = new eventBookingModel_1.default(Object.assign(Object.assign({}, bookingData), { status: 'pending' }));
    console.log(booking, "boooooooooooo");
    yield booking.save();
    return booking;
});
exports.saveBooking = saveBooking;
