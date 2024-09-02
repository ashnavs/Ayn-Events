import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';
import Switch from 'react-switch';
import Modal from 'react-modal';

function ReportDetail() {
  const { id } = useParams();
  const [reports, setReports] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [blockedStatus, setBlockedStatus] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setStatus('loading');
      try {
        const response = await axiosInstance.get(`/reports/${id}`);
        if (response.data.length > 0) {
          setReports(response.data);
          setVendorName(response.data[0].vendorId.name);
          setBlockedStatus(response.data[0].vendorId.is_blocked);
        }
        setStatus('succeeded');
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError(err.message);
        setStatus('failed');
      }
    };

    fetchReports();
  }, [id]);

  const toggleBlockedStatus = async () => {
    const newBlockedStatus = !blockedStatus;
    setBlockedStatus(newBlockedStatus);
    try {
      await axiosInstance.patch(`/blockVendor/${id}`, { is_blocked: newBlockedStatus });
    } catch (err) {
      console.error('Failed to update vendor status:', err);
      setBlockedStatus(!newBlockedStatus);
    }
  };

  const openConfirmModal = () => {
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  };

  const confirmToggleBlockedStatus = async () => {
    await toggleBlockedStatus();
    closeConfirmModal();
  };

  if (status === 'loading') {
    return <p className="text-center">Loading...</p>;
  }

  if (status === 'failed') {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          {vendorName && (
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {vendorName}
            </h1>
          )}
          <div>
            <Switch
              onChange={openConfirmModal}
              checked={blockedStatus}
              onColor="#EF4444"
              offColor="#A39F74"
              uncheckedIcon={false}
              checkedIcon={false}
              height={20}
              width={40}
              borderRadius={10}
            />
         
              <span className={`relative inline-block mt-0 px-3 py-1 font-semibold leading-tight ${!blockedStatus ? 'text-green-900' : 'text-red-900'}`}>
                <span className="relative">{!blockedStatus ? 'Active' : 'Blocked'}</span>
              </span>
            
          </div>
        </div>
        {reports.length > 0 ? (
          <table className="min-w-full bg-white dark:bg-gray-700 shadow-md rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left">
                  Reason
                </th>
                <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300">
                    {report.reason}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300">
                    {new Date(report.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-red-500">No reports found.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirmation Modal"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '8px',
            maxWidth: '400px',
            padding: '20px',
          },
        }}
        ariaHideApp={false}
      >
        <h2 className="text-lg font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">
          Are you sure you want to {blockedStatus ? 'unblock' : 'block'} this vendor?
        </p>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 mr-2 bg-[#a39f74] text-white rounded hover:bg-red-600"
            onClick={confirmToggleBlockedStatus}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={closeConfirmModal}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ReportDetail;
