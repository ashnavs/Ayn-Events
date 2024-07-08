import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signupUser, GoogleAuth } from '../../features/auth/authSlice';  // Corrected path
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth, provider, signInWithPopup } from '../../firebase/firebase'; // Import Firebase functions


function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error,user } = useSelector((state) => state.auth);
  console.log(user);
  

useEffect(()=>{
  if(user){
    navigate('/home')
  }
},[])
  const handleGoogleSignup = async()=> {
    try {
      const result = await signInWithPopup(auth , provider)
      const user = result.user;
      console.log('Google user',user);

      dispatch(GoogleAuth({ email: user.email, name: user.displayName })).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          toast.success('User signed up with Google');
          navigate('/home');
        } else {
          toast.error('Google signup failed');
        }
      });
    } catch (error) {
      console.error('Error during Google signup:', error);
      toast.error('Google signup failed');      
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try { 
      const response = await dispatch(signupUser(values)).unwrap();
      toast.success("User signup success");
      navigate('/otp-verification', {state:{email:values.email}});
    } catch (error) {
      
        toast.error("User already exists");
     
    } finally {
      setSubmitting(false);
    }
  };


  // useEffect(() => {
  //   if (user) {
  //     console.log('User:', user); // Debug: Check the user object
  //   }
  // }, [user]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  return (
    <section className="relative bg-cover bg-center bg-[url('https://marrymetampabay.com/wp-content/uploads/2018/02/18-8.jpg')] bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 sm:p-6 md:space-y-4">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign Up
            </h1>
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4 md:space-y-4">
                  <div>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`bg-gray-50 border ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Your Name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className={`bg-gray-50 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                      placeholder="Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="password"
                      className={`bg-gray-50 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <Field
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="confrim-password"
                      className={`bg-gray-50 border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <button
                    type="submit"
                    className="custom-button-bg w-full text-white bg-[#A39F74] focus:ring-4 focus:outline-none focus:ring-[#8B8964] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                  {error && <div className="text-red-500 text-sm mt-2">{error.message}</div>}
                  <p className="text-sm text-center font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      Sign in
                    </a>
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="px-6 sm:px-0 max-w-sm">
                      <button
                        type="button"
                        onClick={handleGoogleSignup}
                        className="text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mb-2"
                      >
                        <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                          <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Sign up with Google
                      </button>
                    </div>
                  </div>

                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
