import React, { useState } from 'react';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import { toast } from 'sonner';

const ReviewForm = ({ vendorId }) => {
  const user = useSelector(selectUser);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleRating = (rate) => setRating(rate);

  const submitReview = async (vendorId, userId, review, rating) => {
    try {
      const response = await axiosInstanceUser.post('/reviews', { vendorId, userId, review, rating });
      toast.success('Review Submitted');
      console.log('Review and rating submitted successfully:', response.data);
    } catch (error) {
      toast.error('Failed to submit review and rating');
      console.error('Failed to submit review and rating:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = user.id;  
    submitReview(vendorId, userId, review, rating);
    setReview('');
    setRating(0);
  };

  return (
    <div className="p-4 bg-[#f8f4ef] rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Review Vendor Name</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rate Vendor*</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRating(star)}
                className={`w-5 h-5 flex items-center justify-center ${rating >= star ? 'text-[#a39f74]' : 'text-gray-400'}`}
                style={{ borderColor: '#a39f74' }}
              >
                <i className="fas fa-star"></i>
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Tell us about your experience*</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#a39f74]"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-[#a39f74] text-white py-2 px-4 rounded-lg hover:bg-[#94916b]"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
