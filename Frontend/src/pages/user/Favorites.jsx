import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';
import axiosInstanceUser from '../../services/axiosInstanceUser';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const userId = user.id; // Ensure this is the correct way to get the user ID

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch the user's favorite vendors
        const response = await axiosInstanceUser.get(`/favorites/${userId}`);
        const favoriteItems = response.data;

        // Fetch license details for each favorite vendor
        const licenses = await Promise.all(
          favoriteItems.map(async (favorite) => {
            const licenseResponse = await axiosInstanceUser.get(`/license/${favorite.vendorId.email}`);
            return { ...favorite, license: licenseResponse.data };
          })
        );

        setFavorites(licenses);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ProfileSidebar />
        <div className="flex-grow overflow-y-auto p-6 ml-64"> {/* Added margin-left */}
          <div className="container mx-auto p-12">
            <h2 className="text-lg font-semibold mb-4">Found {favorites.length} favorites...</h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a39f74]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-7">
                {favorites.map((favorite) => (
                  <div
                    key={favorite._id}
                    className="bg-white shadow rounded overflow-hidden cursor-pointer"
                  >
                    <img
                      src={favorite.license.logoUrl || 'default-image-url'} // Use the actual default image URL
                      alt={favorite.vendorId.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-2 bg-gray-200 text-center">
                      {favorite.vendorId.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
