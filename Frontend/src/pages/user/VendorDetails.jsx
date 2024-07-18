import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import Header from '../../../src/components/Header'
import VendorLogos from '../../components/VendorLogoU';
import ImageGrid from '../../components/ImageGridU';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const VendorDetails = () => {
  const { id } = useParams();
  console.log(id);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);

  // useEffect(() => {
  //   const fetchVendorDetails = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axiosInstanceUser.get(`/vendorDetails/${id}?timestamp=${new Date().getTime()}`);
  //       setVendor(response.data);
  //       setLoading(false);
  //     } catch (error) {
  //       setError('Failed to fetch vendor details');
  //       setLoading(false);
  //     }
  //   };
  //   fetchVendorDetails();
  // }, [id]);
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceUser.get(`/vendorDetails/${id}?timestamp=${new Date().getTime()}`);
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch vendor details:', error);
        setError('Failed to fetch vendor details. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchVendorDetails();
  }, [id]);

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
    <VendorLogos/>
    <ImageGrid vendorId={vendor._id}/>
    <div className=" mx-auto p-10 bg-[#cbc8af87]">
        {/* <h2 className="text-2xl font-semibold mb-4">Reviews for {vendor.name} ({vendor.reviewsCount})</h2> */}
        <h2 className="text-2xl font-semibold mb-4">Reviews for {vendor.name}</h2>
     <ReviewForm vendorId={vendor._id}  />
      </div>
      <ReviewList vendorId={vendor._id}  />
  </div>
  );
};

export default VendorDetails;
