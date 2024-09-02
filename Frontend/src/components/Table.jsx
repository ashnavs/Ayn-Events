import React from 'react';
import TableRow from './TableRow';

const Table = ({ data, onStatusChange, isUserSide, onStatusCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-sm">
      <div className="flex items-center justify-between bg-gray-100 p-4 text-l">
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">DATE</p>
        </div>
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">{isUserSide ? 'VENDORNAME' : 'USERNAME'}</p>
        </div>
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">EVENT</p>
        </div>
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">STATUS</p>
        </div>
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">ACTION</p>
        </div>
         {isUserSide && (
        <div className="w-1/6">
          <p className="text-gray-800 font-semibold">AMOUNT</p>
        </div>
        )}
          <div className="w-1/6">
            <p className="text-gray-800 font-semibold">DETAILS</p>
          </div>
      </div>
      {data.map((item) => (
        <TableRow
          key={item.bookingId}
          bookingId={item.bookingId}
          date={item.date}
          username={item.userName}
          vendorname={item.vendorName}
          event={item.eventName}
          status={item.status}
          paymentAmount={item.paymentAmount}
          onStatusChange={onStatusChange}
          onStatusCancel={onStatusCancel}
          isUserSide={isUserSide}
        />
      ))}
    </div>
  );
};

export default Table;
