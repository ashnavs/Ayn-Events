
import React, { useState, useEffect } from 'react';
import VendorHeader from '../../components/VendorHeader';
import VendorLogo from '../../components/VendorLogo';
import ImageGrid from '../../components/ImageGrid';
import { useSelector } from 'react-redux';
import { selectVendor } from '../../features/vendor/vendorSlice';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';

function VendorHome() {
  const vendorId = useSelector(selectVendor)?.vendor?.id;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstanceVendor.get(`/getposts/${vendorId}`);
        setPosts(response.data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (vendorId) {
      fetchPosts();
    }
  }, [vendorId]);

    const handleDelete = async (postId) => {
    try {
      await axiosInstanceVendor.delete(`/deleteposts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div>
      <VendorHeader />
      <VendorLogo vendorId={vendorId} onPostCreated={handlePostCreated} />
      <ImageGrid vendorId={vendorId} posts={posts} onDeletePost={handleDelete} />
    </div>
  );
}

export default VendorHome;
