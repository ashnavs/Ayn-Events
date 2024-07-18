import React, { useEffect, useState } from 'react';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';

const ImageGrid = ({ vendorId }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/getposts/${vendorId}`);
        console.log(response);
        setPosts(response.data || []); // Ensure data is always an array
      } catch (error) {
        console.error('Error fetching getposts:', error);
      }
    };

    fetchPosts();
  }, [vendorId]);

  return (
    <div className="bg-[#F8F4EF]  p-4 flex flex-col items-center">
      <div className="grid grid-cols-4 mt-10 gap-4 max-w-6xl">
        {posts.map((post, index) => (
          <div key={index} className="relative overflow-hidden rounded-lg shadow-lg">
            <img src={post.image} alt={`Event ${index + 1}`} className="w-full h-40 object-cover object-center" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
              {post.description}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 rounded-md">View More</button>
    </div>
  );
};

export default ImageGrid;
