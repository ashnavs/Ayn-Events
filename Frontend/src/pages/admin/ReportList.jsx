import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import Sidebar from '../../components/Sidebar';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchReports = async () => {
    setStatus('loading');
    try {
      const response = await axiosInstance.get('/reportlist');
      setReports(response.data);
      console.log(response.data);
      setStatus('succeeded');
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError(err.message);
      setStatus('failed');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/reports/${id}`);
  };


  const filteredReports = reports.filter(({ vendorName }) =>
    vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center bg-white rounded shadow-md">
            <input
              type="text"
              placeholder="Search vendors"
              className="px-4 py-2 w-64 border-none focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="px-4 py-2 bg-gray-200 border-l border-gray-300">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M9 14a5 5 0 1 1 10 0 5 5 0 0 1-10 0zm0 0v1a1 1 0 0 0 1 1h3m-4-6h4"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {status === 'loading' ? (
            <p className="text-center">Loading...</p>
          ) : status === 'failed' ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredReports.length > 0 ? (
            filteredReports.map(({ _id, count, vendorName }) => (
              <div key={_id} className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {vendorName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">Reports: {count}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(_id)}
                  className="text-blue-500 dark:text-blue-400"
                >
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-red-500">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportList;
