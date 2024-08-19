import React from 'react';
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';
import ProfileEdit from '../../components/ProfileEdit';

function UserProfile() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        <ProfileSidebar />
        <div className="flex-grow  overflow-y-auto">
          <ProfileEdit />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
