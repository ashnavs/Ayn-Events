import { log } from "console";
import Booking ,{IBooking}  from "../database/dbmodel/eventBookingModel"


export const checkAvailabilityByDate = async (date: Date, vendorId: string): Promise<IBooking | null> => {
  const booking = await Booking.findOne({ date, vendor: vendorId });
  return booking;
};

export const saveBooking = async (bookingData: IBooking): Promise<IBooking> => {

    log('akjhhskja')
  const booking = new Booking(bookingData);
  await booking.save();
  return booking;
};