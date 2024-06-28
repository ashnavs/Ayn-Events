import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupVendor } from '../../features/vendor/vendorSlice';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {toast} from 'sonner'


const VendorSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.vendor);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    city: Yup.string().required('City is required'),
    vendorType: Yup.string().required('Vendor type is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(signupVendor(values)).unwrap();
      toast.success('Signup success');
      navigate('/vendor/otp-verification', { state: { email: values.email } });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-4" style={{ backgroundImage: `url('https://strange-event.com/wp-content/uploads/2020/02/Event-Organizing-Services.jpg')` }}>
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <Formik
          initialValues={{
            name: '',
            email: '',
            city: '',
            vendorType: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field name="name" type="text" placeholder="Enter your name" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="email" type="email" placeholder="Enter your email" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="city" type="text" placeholder="Enter your city" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="vendorType" type="text" placeholder="Type of vendor" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="vendorType" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="password" type="password" placeholder="Enter your password" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button className="w-full px-4 py-2 bg-[#a39f74] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74d6] focus:outline-none focus:border-[#a39f74d6]" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Already have an account? <a href="/vendor/login" className="text-[#a39f74] hover:underline">Log in</a></p>
        </div>
      </div>
    </div>
  );
}

export default VendorSignup;