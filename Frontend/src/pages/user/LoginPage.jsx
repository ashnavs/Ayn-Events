// LoginPage.jsx

import React, { useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { loginUser, clearError, GoogleAuth } from '../../features/auth/authSlice';
import { auth, provider, signInWithPopup  } from '../../firebase/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error ,user } = useSelector((state) => state.auth);
console.log("Auth state:", useSelector((state) => state.auth)); // Log entire state


  useEffect(()=>{
    if(user && user.is_blocked === false){
      navigate('/home')
    }
  }, [user, navigate])

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const idToken = credential.accessToken;
      const user = result.user;

      const userData = {
        idToken,
        email: user.email,
        name: user.displayName,
        // Add any additional user data you need
      };

      dispatch(GoogleAuth(userData))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            const userId = response.payload.response.user?.id;
            if (userId) {
              console.log('Login successful. User ID:', userId);
              toast.success('User signed up with Google');
              navigate('/home');
            } else {
              console.error('User ID is undefined:', response.payload.user);
              toast.error('Google signup failed');
            }
          } else {
            toast.error('Google signup failed');
          }
        })
        .catch((error) => {
          console.error('Error dispatching Google login:', error);
          toast.error('Google login failed');
        });
    } catch (error) {
      console.error('Error during Google login:', error);
      toast.error('Google login failed');
    }
  };

 
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      console.log(response)
      toast.success('User login success');
      navigate('/home');
    } catch (error) {
      const errorMessage = 
        error.error?.message || 
        error.message || 
        error.data?.message || 
        'Login failed';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <div className="relative w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://marrymetampabay.com/wp-content/uploads/2018/02/18-8.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign In
            </h1>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`bg-gray-50 border ${
                        errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                      } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="name@company.com"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className={`bg-gray-50 border ${
                        errors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                      } text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="flex items-center justify-center">
                    <a href="#" className="text-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-[#A39F74] hover:bg-[#a39f74d5] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#A39F74] dark:hover:bg-[#A39F74] dark:focus:ring-primary-800"
                    disabled={isSubmitting}
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                  {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                  <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Sign up
                    </a>
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="px-6 sm:px-0 max-w-sm">
                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
                      >
                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 25.9 3.9 39.6z"></path>
                        </svg>
                        Sign in with Google
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
