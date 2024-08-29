// import React, { useEffect, useState } from 'react';
// import axiosInstanceVendor from '../services/axiosInstanceVenndor';
// import { FaTrash } from 'react-icons/fa';

// const ImageGrid = ({ vendorId }) => {
//   const [posts, setPosts] = useState([]);
//   const [itemsToShow, setItemsToShow] = useState(8); // Initial number of items to show
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axiosInstanceVendor.get(`/getposts/${vendorId}`);
//         console.log('Fetched posts:', response.data);
//         setPosts(response.data || []);

//         // Check if there are more posts to load
//         if (response.data.length <= itemsToShow) {
//           setHasMore(false); // No more posts to load
//         } else {
//           setHasMore(true); // There are still more posts to load
//         }
//       } catch (error) {
//         console.error('Error fetching posts:', error);
//       }
//     };

//     fetchPosts();
//   }, [vendorId, itemsToShow]);

//   const handleDelete = async (postId) => {
//     try {
//       await axiosInstanceVendor.delete(`/deleteposts/${postId}`);
//       setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
//     } catch (error) {
//       console.error('Error deleting posts:', error);
//     }
//   };

//   const loadMoreItems = () => {
//     const newItemsToShow = itemsToShow + 8;
//     setItemsToShow(newItemsToShow);
//     if (newItemsToShow >= posts.length) {
//       setHasMore(false); // If all posts are shown, disable the "Load More" button
//     }
//   };

//   return (
//     <div className="bg-[#F8F4EF] p-4 flex flex-col items-center">
//       <div className="grid grid-cols-4 mt-10 gap-4 max-w-6xl">
//         {posts.slice(0, itemsToShow).map((post, index) => (
//           <div key={post._id} className="relative overflow-hidden rounded-lg shadow-lg">
//             <img src={post.image} alt={`Event ${index + 1}`} className="w-full h-40 object-cover object-center" />
//             <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
//               {post.description}
//             </div>
//             <button
//               onClick={() => handleDelete(post._id)}
//               className="absolute top-0 right-0 text-white p-1 m-2 rounded-md bg-[#a39f74] hover:bg-[#8f8a64]"
//             >
//               <FaTrash className="w-3 h-3 text-white" />
//             </button>
//           </div>
//         ))}
//       </div>
//       {hasMore && (
//         <button
//           onClick={loadMoreItems}
//           className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 rounded-md hover:bg-[#B0AC8D]"
//         >
//           Load More
//         </button>
//       )}
//       {!hasMore && (
//         <p className="text-center mt-4">No more images</p>
//       )}
//     </div>
//   );
// };

// export default ImageGrid;


import React, { useEffect, useState } from 'react';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import { FaTrash } from 'react-icons/fa';

// ImageGrid.jsx
const ImageGrid = ({ posts,onDeletePost }) => {
  const [itemsToShow, setItemsToShow] = useState(8); // Initial number of items to show
  const [hasMore, setHasMore] = useState(true);


  const loadMoreItems = () => {
    const newItemsToShow = itemsToShow + 8;
    setItemsToShow(newItemsToShow);
    if (newItemsToShow >= posts.length) {
      setHasMore(false); // If all posts are shown, disable the "Load More" button
    }
  };

    const handleDelete = async (postId) => {
    try {
      await axiosInstanceVendor.delete(`/deleteposts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error('Error deleting posts:', error);
    }
  };

  return (
    <div className="bg-[#F8F4EF] p-4 flex flex-col items-center">
      <div className="grid grid-cols-4 mt-10 gap-4 max-w-6xl">
        {posts.slice(0, itemsToShow).map((post, index) => (
          <div key={post._id} className="relative overflow-hidden rounded-lg shadow-lg">
            <img src={post.image} alt={`Event ${index + 1}`} className="w-full h-40 object-cover object-center" />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-sm">
              {post.description}
            </div>
            <button
              onClick={() => onDeletePost(post._id)}
              className="absolute top-0 right-0 text-white p-1 m-2 rounded-md bg-[#a39f74] hover:bg-[#8f8a64]"
            >
              <FaTrash className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={loadMoreItems}
          className="mt-8 bg-[#CBC8AF] text-white py-2 px-6 rounded-md hover:bg-[#B0AC8D]"
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

