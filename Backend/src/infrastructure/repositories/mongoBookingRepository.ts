import { log } from "console";
import Booking ,{IBooking}  from "../database/dbmodel/eventBookingModel"


export const checkAvailabilityByDate = async (date: Date, vendorId: string): Promise<IBooking | null> => {
  const booking = await Booking.findOne({ date, vendor: vendorId });
  return booking;
};

export const saveBooking = async (bookingData: Partial<IBooking>): Promise<IBooking> => {

  console.log('Booking data received:', bookingData); // Add this line to debug

    const booking = new Booking({
      ...bookingData,
      status: 'pending',
    });
  console.log(booking,"boooooooooooo")
  await booking.save();
  return booking;
};