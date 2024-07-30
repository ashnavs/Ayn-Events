import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstanceUser from '../services/axiosInstanceUser';
import { FiStar } from 'react-icons/fi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

const VendorLogos = () => {
  const userId = useSelector(selectUser);
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState(null);

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
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsReportModalOpen(false);
    setIsAvailabilityModalOpen(false);
    setIsBookingFormOpen(false);
    setIsPaymentModalOpen(false);
    setIsConfirmationModalOpen(false);
  };

  const handleReportSubmit = async (values, { setSubmitting }) => {
    const reportData = {
      vendorId: id,
      reason: values.reason,
      date: new Date(),
    };
    
    try {
      setSubmitting(true);
      await axiosInstanceUser.post('/report', reportData);
      console.log(reportData);
      toast.success('Report submitted');
      setIsReportModalOpen(false);
    } catch (error) {
      toast.error(error.message);
      console.error('Failed to submit report', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvailabilityCheck = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const response = await axiosInstanceUser.post('/checkAvailability', { date: values.date, vendorId: id });
      if (response.data.available) {
        setIsBookingFormOpen(true);
      } else {
        toast.error('Date not available');
      }
      setIsAvailabilityModalOpen(false);
    } catch (error) {
      console.error('Failed to check availability', error);
      toast.error('Failed to check availability');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      const bookingData = {
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        date: values.date,
        amount: values.amount,
        address: {
          city: values.city,
          state: values.state,
          pincode: values.pincode,
          phone: values.phone
        },
        vendor_name: vendor.name,
        user: userId.id,
        vendor: vendor._id,
        status: false,
        payment_status: true,
        payment: {
          amount: values.amount,
          transaction_id: ''
        }
      };
      setBookingData(bookingData);
      setIsPaymentModalOpen(true);
      setIsBookingFormOpen(false);
      setSubmitting(false);
    } catch (error) {
      console.error('Failed to create booking', error);
      toast.error('Failed to create booking');
      setSubmitting(false);
    }
  };

  const handlePayment = () => {
    const options = {
      key: 'rzp_test_PwlGsaqF0giaNH',
      amount: bookingData.payment.amount * 100,
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Event Booking Payment',
      handler: async (response) => {
        bookingData.payment.transaction_id = response.razorpay_payment_id;
        try {
          await axiosInstanceUser.post('/bookings', bookingData)
            .then(() => {
              toast.success('Booking successful');
              setIsPaymentModalOpen(false);
              setIsConfirmationModalOpen(true);
            })
            .catch((error) => {
              toast.error(error.message);
            });
        } catch (error) {
          console.error('Failed to save booking', error);
          toast.error('Failed to save booking');
        }
      },
      prefill: {
        name: userId.name,
        email: userId.email,
        contact: bookingData.mobile
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
  });

  const availabilitySchema = Yup.object().shape({
    date: Yup.date().required('Date is required'),
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
            </div>
          </div>

          <div className="mt-4 flex justify-around">
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md">Chat with us</button>
            <button
              className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md"
              onClick={() => setIsAvailabilityModalOpen(true)}
            >
              Check Availability
            </button>
            <button className="bg-[#CBC8AF] text-white py-2 px-4 rounded-md" onClick={handleReportClick}>Report</button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
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
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#a39f74] text-white rounded"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Availability Modal */}
      {isAvailabilityModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Check Availability</h2>
            <Formik
              initialValues={{ date: '' }}
              validationSchema={availabilitySchema}
              onSubmit={handleAvailabilityCheck}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="date"
                    name="date"
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#a39f74] hover:bg-[#94916b] text-white rounded"
                      disabled={isSubmitting}
                    >
                      Check
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Booking Form */}
      {isBookingFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Booking Form</h2>
            <Formik
              initialValues={{
                name: '',
                email: '',
                mobile: '',
                date: '',
                amount: '',
                city: '',
                state: '',
                pincode: '',
                phone: ''
              }}
              onSubmit={handleBookingSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Name"
                    required
                  />
                  <Field
                    type="email"
                    name="email"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Email"
                    required
                  />
                  <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Mobile"
                    required
                  />
                  <Field
                    type="date"
                    name="date"
                    className="w-full p-2 border rounded mb-4"
                    required
                  />
                  <Field
                    type="number"
                    name="amount"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Amount"
                    required
                  />
                  <Field
                    type="text"
                    name="city"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="City"
                    required
                  />
                  <Field
                    type="text"
                    name="state"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="State"
                    required
                  />
                  <Field
                    type="text"
                    name="pincode"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Pincode"
                    required
                  />
                  {/* <Field
                    type="text"
                    name="phone"
                    className="w-full p-2 border rounded mb-4"
                    placeholder="Phone"
                    required
                  /> */}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#a39f74] text-white rounded"
                      disabled={isSubmitting}
                    >
                      Book
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Payment</h2>
            <p>Amount: {bookingData.payment.amount}</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#a39f74] text-white rounded"
                onClick={handlePayment}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Booking Confirmed</h2>
            <p>Your booking has been successfully confirmed.</p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-4 py-2 bg-[#a39f74] text-white rounded"
                onClick={handleCloseModal}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLogos;
