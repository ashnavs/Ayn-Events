import React, { useEffect, useState } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';

const ReviewList = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showViewMore, setShowViewMore] = useState(false);
  const [showViewLess, setShowViewLess] = useState(false);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await axiosInstanceUser.get(`/getreviews?vendorId=${vendorId}`);
        console.log(response.data);
        setReviews(response.data);
        if (response.data.length > 2) {
          setShowViewMore(true);
        }
      } catch (error) {
        console.error('Error fetching reviews', error);
      }
    };

    getReviews();
  }, [vendorId]);

  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
    if (visibleReviews + 5 >= reviews.length) {
      setShowViewMore(false);
    }
    setShowViewLess(true);
  };

  const handleViewLess = () => {
    setVisibleReviews(3);
    setShowViewMore(true);
    setShowViewLess(false);
  };

  return (
    <div className='bg-[#f0ece3] pt-2'>
      {reviews.slice(0, visibleReviews).map((review, index) => (
        <div key={review._id} className={`p-6 bg-white rounded ${index !== reviews.length - 1 ? "border-b-2 border-[#c7c3a2]" : ''}`}>
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              <span className="text-gray-600">{review.userName[0]}</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold">{review.userName}</h4>
              <div className="flex items-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`fas fa-star ${review.rating > i ? 'text-[#a39f74]' : 'text-gray-200'}`}></span>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">{review.rating}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 pt-2">{review.review}</p>
        </div>
      ))}
      <div className="flex justify-center">
        {showViewMore && (
          <button onClick={loadMoreReviews} className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 mb-10 rounded-md">View More</button>
        )}
        {showViewLess && (
          <button onClick={handleViewLess} className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 mb-10 rounded-md ml-4">View Less</button>
        )}
      </div>
    </div>
  );
};

export default ReviewList;

