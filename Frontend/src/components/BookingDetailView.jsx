import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import axiosInstanceUser from '../services/axiosInstanceUser';
import { format } from 'date-fns';
import VendorHeader from './VendorHeader';
import Header from './Header'
import { FaArrowAltCircleLeft } from 'react-icons/fa';

function BookingDetailView({ isUserSide }) {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBookingDetail = async () => {
      try {
        const response = isUserSide
          ? await axiosInstanceUser.get(`/bookingdetails/${bookingId}`)
          : await axiosInstanceVendor.get(`/bookingdetails/${bookingId}`);
        
        const bookingData = response.data;
        console.log("bookdata:",bookingData);
        
        setBooking({
          bookingId: bookingData._id,
          customerName: bookingData.user?.name || bookingData.vendor?.name,
          customerEmail: bookingData.user?.email || bookingData.vendor?.email,
          contactPhone: bookingData.address.phone,
          eventDate: format(new Date(bookingData.date), 'MMMM dd, yyyy'),
          status: bookingData.status,
          eventType: bookingData.event_name,
          amount: bookingData.payment.amount,
          address: `${bookingData.address.city}, ${bookingData.address.state} - ${bookingData.address.pincode}`  
        });
      } catch (error) {
        console.error('Error fetching booking detail:', error);
      }
    };

    fetchBookingDetail();
  }, [bookingId, isUserSide]);

  if (!booking) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex flex-col bg-gray-50">
      {isUserSide ? <Header /> : <VendorHeader />}
      <div className="flex-grow flex justify-center pt-10">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Booking Details</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F8F4EF] rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Name:</p>
                <p className="w-2/3">{booking.customerName}</p>
              </div>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Email:</p>
                <p className="w-2/3">{booking.customerEmail}</p>
              </div>
                <div className="mb-2 flex items-center">
                    <p className="font-semibold w-1/3">Phone:</p>
                    <p className="w-2/3">{booking.contactPhone}</p>
                </div>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Address:</p>
                <p className="w-2/3">{booking.address}</p>
              </div>
            </div>
            <div className="p-6 bg-[#F8F4EF] rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Event Information</h2>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Event Date:</p>
                <p className="w-2/3">{booking.eventDate}</p>
              </div>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Status:</p>
                <p className="w-2/3">{booking.status}</p>
              </div>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Event Type:</p>
                <p className="w-2/3">{booking.eventType}</p>
              </div>
              <div className="mb-2 flex items-center">
                <p className="font-semibold w-1/3">Token Amount:</p>
                <p className="w-2/3">{booking.amount}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <FaArrowAltCircleLeft
              className="text-[#a29f74] text-3xl cursor-pointer"
              onClick={() => navigate(-1)} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailView;

