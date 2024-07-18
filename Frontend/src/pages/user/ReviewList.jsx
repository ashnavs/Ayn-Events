import React, { useEffect, useState } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';

const ReviewList = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axiosInstanceUser.get(`/getreviews?vendorId=${vendorId}`);
        console.log(response.data);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    getReviews();
  }, [vendorId]);

  return (
    <div className="mt-8">
      {reviews.map((review) => (
        <div key={review._id} className="p-10 bg-white rounded-lg mx-10 shadow-lg mb-4">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600">{review.userId[0]}</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{review.userId}</h4>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`fas fa-star ${review.rating >= i + 1 ? 'text-[#a39f74]' : 'text-gray-200'}`}></span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{review.rating}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{review.review}</p>
        </div>
      ))}
      <div className="flex justify-center">
        <button className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 mb-10 rounded-md">View More</button>
      </div>
    </div>
  );
};

export default ReviewList;
