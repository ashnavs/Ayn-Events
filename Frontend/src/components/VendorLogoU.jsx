import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstanceUser from '../services/axiosInstanceUser';
import { FiStar } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';

const VendorLogos = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstanceUser.get(`/vendorDetails/${id}?timestamp=${new Date().getTime()}`);
        setVendor(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch vendor details');
        setLoading(false);
      }
    };
    fetchVendorDetails();
  }, [id]);

  const handleReportClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleReportSubmit = async (values, { setSubmitting }) => {
    const reportData = {
      vendorId: id,
      reason: values.reason,
      date: new Date(),
    };
    try {
      setSubmitting(true);
      await axiosInstanceUser.post('/report', reportData)
        .then(() => {
          toast.success('Report submitted');
        })
        .catch((error) => {
          toast.error(error.message);
        });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to submit report', error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
  });

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
  }

  if (!vendor) {
    return <p className="text-center mt-8 text-gray-500">No vendor details found for ID: {id}</p>;
  }

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`w-5 h-5 ${i <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-[#ffffff] p-4 flex flex-col items-center" style={{ height: '464px' }}>
      <div className="w-full max-w-6xl rounded-lg mt-8">
        <div className="relative h-72 rounded-t-lg overflow-hidden">
          <img
            src="https://celestialevents.in/wp-content/uploads/2020/09/services-three.jpg"
            alt="Vendor"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative p-5 bg-[#F0ECE3] transform translate-y-[-50%] mx-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p>{vendor.email}</p>
              <p>{vendor.city}</p>
              <p>{vendor.service}</p>
            </div>
            <div className="flex items-center rounded-full">
              {renderStars(vendor.rating)}
              {/* <div className="bg-[#D1C7B7] text-white rounded-full px-2 py-1 ml-2">
                <span className="text-lg font-semibold">{vendor.rating || '4.7'} Ratings</span>
              </div> */}
            </div>
          </div>

          <div className="mt-4 flex justify-around">
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Chat with us</button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Check Availability</button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md" onClick={handleReportClick}>Report</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reason for Reporting</h2>
            <Formik
              initialValues={{ reason: '' }}
              validationSchema={validationSchema}
              onSubmit={handleReportSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    name="reason"
                    as="textarea"
                    className="w-full p-2 border rounded mb-4"
                    rows="4"
                    placeholder="Describe your reason"
                    required
                  />
                  <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                      onClick={handleCloseModal}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 bg-[#b8b59b] text-white rounded hover:bg-[#a39f74] ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Report Vendor'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLogos;
