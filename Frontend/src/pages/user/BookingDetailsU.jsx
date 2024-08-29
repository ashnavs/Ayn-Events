import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Table from '../../components/Table';
import ProfileSidebar from '../../components/ProfileSidebar';
import { useParams } from 'react-router-dom';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import {format} from 'date-fns'

function BookingDetailsU() {
    const {userId} = useParams()
    console.log(userId)
    const [bookingData, setBookingData] = useState([]);
    
    useEffect(() => {
        const fetchBookingData = async () => {
          try {
            const response = await axiosInstanceUser.get(`/booking/${userId}`); 
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

      // const handleStatusChange = async (bookingId, newStatus) => {
      //   try {
      //     const response = await axiosInstanceUser.patch(`/bookings/${bookingId}/cancel`, { status: newStatus });
      //     setBookingData(prevData =>
      //       prevData.map(item =>
      //         item.bookingId === bookingId ? { ...item, status: newStatus } : item
      //       )
      //     );
      //   } catch (error) {
      //     console.error('Error updating status:', error);
      //   }
      // };

      const handleStatusChange = async (bookingId, newStatus) => {
        try {
          const response = await axiosInstanceUser.patch(`/bookings/${bookingId}/cancel`, { status: newStatus });
      
          if (response.status === 200) {
            setBookingData(prevData =>
              prevData.map(item =>
                item.bookingId === bookingId ? { ...item, status: newStatus, isConfirmed: false } : item
              )
            );
            if (newStatus === 'cancelled') {
              alert('Booking cancelled successfully and amount credited to your wallet.');
            }
          }
        } catch (error) {
          console.error('Error updating status:', error);
          alert('Failed to update booking status. Please try again later.');
        }
      };
      

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ProfileSidebar />
        <div className="flex-grow  overflow-y-auto ml-64">
        <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <Table data={bookingData} isUserSide={true} onStatusCancel={handleStatusChange}/>
      </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsU;
