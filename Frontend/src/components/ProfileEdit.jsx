import React, { useState } from 'react';
import { FaEdit, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser,updateUser } from '../features/auth/authSlice';


const ProfileEdit = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser);
  const userId = user.id
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    dispatch(updateUser({ userId, name }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  return (
    <div className="flex-grow flex flex-col items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-[#F8F4EF] p-3">
            <FaUser className="text-[#a39f74]" size={24} />
          </div>
        </div>
        <div className="flex items-center justify-center mb-2">
          {isEditing ? (
            <input
              type="text"
              className="border border-gray-300 rounded-md px-2 py-1 text-center"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <h2 className="text-2xl font-semibold">{name}</h2>
          )}
          <button
            className="ml-2 bg-transparent border-none cursor-pointer"
            onClick={isEditing ? handleSaveClick : handleEditClick}
          >
            <FaEdit className="text-[#a39f74]" />
          </button>
        </div>
        <div className="text-gray-600 mb-4">
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
