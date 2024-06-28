import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function License() {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate()

  const initialValues = {
    license: null,
    logo: null,
  };

  const validationSchema = Yup.object().shape({
    license: Yup.mixed().required('License file is required'),
    logo: Yup.mixed().required('Logo file is required'),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setTimeout(() => {
      setSubmitted(true);
      resetForm();
      toast.success('License Uploaded');
    }, 2000); // Simulating a delay
  };

  const handleLoginNavigation = () => {
    navigate('/vendor/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Your License</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="license">Upload License</label>
                    <input
                      id="license"
                      name="license"
                      type="file"
                      onChange={(event) => setFieldValue('license', event.currentTarget.files[0])}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                      accept="image/*"
                    />
                    <ErrorMessage name="license" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="logo">Upload Logo</label>
                    <input
                      id="logo"
                      name="logo"
                      type="file"
                      onChange={(event) => setFieldValue('logo', event.currentTarget.files[0])}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                      accept="image/*"
                    />
                    <ErrorMessage name="logo" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#c7c3a2] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74] focus:outline-none focus:ring focus:border-blue-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold mb-6">License Upload Completed</h2>
            <p className="text-gray-700 mb-4">You will get an approval message after confirmation within 3 days.</p>
            <button
              className="w-full px-4 py-2 bg-[#c7c3a2] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74] focus:outline-none focus:ring focus:border-blue-300"
              onClick={handleLoginNavigation}
            >
              Go to Login
            </button>

            
          </div>
        )}
      </div>
    </div>
  );
}

export default License;
