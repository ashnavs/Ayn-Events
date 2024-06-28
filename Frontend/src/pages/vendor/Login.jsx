import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginVendor } from '../../features/vendor/vendorSlice'; // Adjust the path as necessary

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(loginVendor(values)).unwrap();
      toast.success('Login success');
      navigate('/vendor/profile');
    } catch (error) {
        toast.error(error.error || error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url('https://strange-event.com/wp-content/uploads/2020/02/Event-Organizing-Services.jpg')` }}>
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Field name="email" type="email" placeholder="Enter your email" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field name="password" type="password" placeholder="Enter your password" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button className="w-full px-4 py-2 bg-[#a39f74] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74d6] focus:outline-none focus:ring focus:border-blue-300" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <p className="text-gray-600">Don't have an account? <a href="/vendor/signup" className="text-[#a39f74] hover:underline">Sign Up</a></p>
          <p className="text-gray-600"><a href="/forgot-password" className="text-[#a39f74] hover:underline">Forgot password?</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
