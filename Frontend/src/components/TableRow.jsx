import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstanceUser from '../services/axiosInstanceUser';

const TableRow = ({ bookingId, date, username, vendorname, event, status, paymentAmount, onStatusChange, isUserSide, onStatusCancel }) => {

  const detailsUrl = isUserSide 
    ? `/bookingdetails/${bookingId}` 
    : `/vendor/bookingdetails/${bookingId}`;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* Date */}
      <div className="w-1/6">
        <p className="text-gray-600">{date}</p>
      </div>
      
      {/* Username or Vendorname */}
      <div className="w-1/6">
        <p className="text-gray-600">{isUserSide ? vendorname : username}</p>
      </div>

      {/* Event Name */}
      <div className="w-1/6">
        <p className="text-gray-600">{event}</p>
      </div>

      {/* Status */}
      <div className="w-1/6">
        <p className="text-gray-600">{status}</p>
      </div>

      {/* Action Buttons */}
      <div className="w-1/6 flex space-x-2">
        {isUserSide ? (
          <button 
            className={`bg-red-500 text-white px-2 py-1 rounded ${status === 'Cancelled' || status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => onStatusCancel(bookingId, 'Cancelled')}
            disabled={status === 'Cancelled' || status === 'Rejected'}
          >
            Cancel
          </button>
        ) : (
          <>
            <button 
              className={`bg-[#a39f74] text-white px-2 py-1 rounded ${status === 'Cancelled' || status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => onStatusChange(bookingId, 'Accepted')}
              disabled={status === 'Cancelled'}
            >
              Accept
            </button>
            <button 
              className={`bg-red-500 text-white px-2 py-1 rounded ${status === 'Cancelled' || status === 'Rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => onStatusChange(bookingId, 'Rejected')}
              disabled={status === 'Cancelled' || status === 'Rejected'}
            >
              Reject
            </button>
          </>
        )}
      </div>

      {/* Payment Amount (only visible on the user side) */}
      {isUserSide && (
        <div className="w-1/6">
          <p className="text-gray-600">{paymentAmount}</p>
        </div>
      )}

      {/* Details Link */}
      <div className="w-1/6">
        <Link to={detailsUrl} className="text-[#a39f74]">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default TableRow;
