import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ProfileSidebar from '../../components/ProfileSidebar';
import axiosInstanceUser from '../../services/axiosInstanceUser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/authSlice';

function WalletPage() {
  const user = useSelector(selectUser);
  const userId = user.id;
  console.log(userId)
  const [walletData, setWalletData] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axiosInstanceUser.get(`/wallet/${userId}`);
        console.log(response.data);
        setWalletData(response.data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      }
    };

    fetchWalletData();
  }, [userId]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="flex flex-grow">
        <ProfileSidebar />
        <div className="flex-grow overflow-y-auto p-6 ml-64">
          {/* Added ml-64 to account for the sidebar width */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-[#c7c3a2] p-5 text-white">
              <h1 className="text-3xl font-bold">Wallet</h1>
              {walletData && (
                <p className="text-3xl font-semibold mt-2">₹{walletData.balance.toFixed(2)}</p>
              )}
            </div>
            <div className="p-6">
              {walletData ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Transactions</h2>
                  <div className="space-y-4">
                    {walletData.transactions.map((transaction, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="font-medium text-gray-800">{transaction.type}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <p
                            className={`text-lg font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-700 mt-2">
                          <p><span className="font-semibold">Event:</span> {transaction.booking.event_name}</p>
                          <p><span className="font-semibold">Vendor:</span> {transaction.booking.vendor_name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#a39f74]"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
