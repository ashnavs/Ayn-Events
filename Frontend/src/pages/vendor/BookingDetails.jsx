import React, { useEffect, useState } from 'react';
import VendorHeader from '../../components/VendorHeader';
import Table from '../../components/Table';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';
import { useParams } from 'react-router-dom';
import {format} from 'date-fns';

function BookingDetails() {

    const{vendorId} = useParams()
  const [bookingData, setBookingData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/bookings/${vendorId}`); 
        console.log(response)
        const transformedData = response.data.map(booking => ({
          bookingId: booking._id,
          vendorName: booking.vendor_name,
          eventName: booking.event_name,
          userName: booking.user.name,
          userEmail: booking.user.email,
          city: booking.address.city,
          state: booking.address.state,
          pincode: booking.address.pincode,
          phone: booking.address.phone,
          amount: booking.amount,
          paymentAmount: booking.payment.amount,
          paymentTransactionId: booking.payment.transaction_id,
          // date: booking.date,
          date: format(new Date(booking.date), 'dd/MM/yyyy'),
          isConfirmed: booking.is_confirmed,
          status: booking.status 
        }));
        console.log(transformedData)
        setBookingData(transformedData);
        console.log(transformedData)
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const response = await axiosInstanceVendor.patch(`/booking/${bookingId}`, { status: newStatus });
      setBookingData(prevData =>
        prevData.map(item =>
          item.bookingId === bookingId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <VendorHeader />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <Table data={bookingData} onStatusChange={handleStatusChange} />
      </div>
    </div>
  );
}

export default BookingDetails;
