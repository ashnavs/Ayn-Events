import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import Header from '../../../src/components/Header';
import VendorLogos from '../../components/VendorLogoU';
import ImageGrid from '../../components/ImageGridU';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import Footer from '../../components/Footer';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userHasBooking, setUserHasBooking] = useState(false);
  const user = useSelector(selectUser);
  const userId = user?.id;


  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceUser.get(`/vendorDetails/${id}?timestamp=${new Date().getTime()}`);
        setVendor(response.data);

        if (userId) {
          const bookingResponse = await axiosInstanceUser.get(`/bookings?userId=${userId}&vendorId=${id}`);
          if (bookingResponse.data.length > 0) {
            setUserHasBooking(true);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch vendor details:', error);
        setError('Failed to fetch vendor details. Please try again later.');
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id, userId]);

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  if (!vendor) {
    return <p className="text-center mt-8 text-gray-500">No vendor details found for ID: {id}</p>;
  }

  return (
    <div>
      <Header />
      <VendorLogos />
      <ImageGrid vendorId={vendor._id} />
      <div className="mx-auto p-10 bg-[#cbc8af87]">
        {userHasBooking && <ReviewForm vendorId={vendor._id} />}
      </div>
      <div className="mx-auto p-10 bg-[#f0ece3]">
        <h2 className="text-2xl font-semibold mb-4">Reviews & Ratings</h2>
        <ReviewList vendorId={vendor._id} />
      </div>
      <Footer />
    </div>
  );
};

export default VendorDetails;
