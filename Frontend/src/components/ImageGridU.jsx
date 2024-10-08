import React, { useEffect, useState } from 'react';
import axiosInstanceUser from '../services/axiosInstanceUser';

const ImageGrid = ({ vendorId }) => {
  const [allPosts, setAllPosts] = useState([]); 
  const [postsToShow, setPostsToShow] = useState([]); 
  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstanceUser.get(`/getposts/${vendorId}`);
        const allPostsData = response.data || [];

        setAllPosts(allPostsData); 
        setPostsToShow(allPostsData.slice(0, itemsPerPage)); 
        if (allPostsData.length <= itemsPerPage) {
          setHasMore(false); 
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [vendorId, itemsPerPage]);

  const loadMore = () => {
    const newPage = currentPage + 1;
    const newPostsToShow = allPosts.slice(0, newPage * itemsPerPage);

    setPostsToShow(newPostsToShow);
    setCurrentPage(newPage);

    if (newPostsToShow.length >= allPosts.length) {
      setHasMore(false); 
    }
  };

  return (
    <div className="bg-[#F8F4EF] p-4 flex flex-col items-center">
      <div className="grid grid-cols-4 gap-4 mt-10 max-w-6xl">
        {postsToShow.map((post) => (
          <div
            key={post._id}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={post.image}
              alt={`Event ${post._id}`}
              className="w-full h-40 object-cover object-center"
            />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
              {post.description}
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-4 px-4 py-2 bg-[#a39f74] text-white rounded-lg hover:bg-[#928c6d] transition-all duration-300"
        >
          Load More
        </button>
      )}
      {!hasMore && (
        <p className="text-center mt-4">No more images</p>
      )}
    </div>
  );
};

export default ImageGrid;
