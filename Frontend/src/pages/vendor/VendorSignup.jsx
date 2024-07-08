// import React, { useEffect, useState } from 'react';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { toast } from 'sonner';
// import { signupVendor } from '../../features/vendor/vendorSlice';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { fetchCities } from '../../services/cityService';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';

// const VendorSignup = () => {
 
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [cities, setCities] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const serviceResponse = await axios.get('http://localhost:5000/api/vendor/service-types');
//         const services = serviceResponse.data;
//         setServices(services);

//         const cityList = await fetchCities();
//         setCities(cityList);
//       } catch (error) {
//         setError('Failed to fetch data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, []);

//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required('Name is required'),
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     city: Yup.string().required('City is required'),
//     vendorType: Yup.string().required('Vendor type is required'),
//     password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//     confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
//   });

//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const response = await dispatch(signupVendor(values)); 
//       console.log(response.payload.vendor.redirectTo,"😘😘😘😘😘")
//       if (response.payload.vendor && response.payload.vendor.redirectTo) {
//         navigate(response.payload.vendor.redirectTo, { state: { email: values.email } });
//       } else if (response.otpGenerated) {
//         toast.success('OTP sent to your email');
//         navigate('/vendor/otp-verification', { state: { email: values.email } });
//       } else {
//         toast.success('Signup success');
//         navigate('/vendor/otp-verification', { state: { email: values.email } });
//       }
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-4">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Vendor Signup</h2>
//         <Formik
//           initialValues={{
//             name: '',
//             email: '',
//             city: '',
//             vendorType: '',
//             password: '',
//             confirmPassword: '',
//           }}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form>
//               <div className="mb-4">
//                 <Field
//                   name="name"
//                   type="text"
//                   placeholder="Enter your name"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 />
//                 <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div className="mb-4">
//                 <Field
//                   name="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 />
//                 <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div className="mb-4">
//                 <Field
//                   as="select"
//                   name="city"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 >
//                   <option value="" disabled>
//                     {loading ? 'Loading cities...' : 'Select your city'}
//                   </option>
//                   {error ? (
//                     <option disabled>{error}</option>
//                   ) : (
//                     cities.map((city, index) => (
//                       <option key={index} value={city}>
//                         {city}
//                       </option>
//                     ))
//                   )}
//                 </Field>
//                 <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div className="mb-4">
//                 <Field
//                   as="select"
//                   name="vendorType"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 >
//                   <option value="" disabled>
//                     {loading ? 'Loading services...' : 'Select your service type'}
//                   </option>
//                   {error ? (
//                     <option disabled>{error}</option>
//                   ) : (
//                     services.map((service, index) => (
//                       <option key={index} value={service}>
//                         {service}
//                       </option>
//                     ))
//                   )}
//                 </Field>
//                 <ErrorMessage name="vendorType" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div className="mb-4 mt-4">
//                 <Field
//                   name="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 />
//                 <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <div className="mb-4">
//                 <Field
//                   name="confirmPassword"
//                   type="password"
//                   placeholder="Confirm Password"
//                   className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
//                 />
//                 <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
//               </div>
//               <button
//                 className="w-full px-4 py-2 bg-[#a39f74] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74d6] focus:outline-none focus:border-[#a39f74d6]"
//                 type="submit"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//               </button>
//             </Form>
//           )}
//         </Formik>
//         <div className="mt-4 text-center">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <a href="/vendor/login" className="text-[#a39f74] hover:underline">
//               Log in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VendorSignup;
import React, { useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { signupVendor } from '../../features/vendor/vendorSlice';
import { useNavigate } from 'react-router-dom';
import { fetchCities } from '../../services/cityService';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Autosuggest from 'react-autosuggest';

const VendorSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [city, setCity] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const serviceResponse = await axios.get('http://localhost:5000/api/vendor/service-types');
        const services = serviceResponse.data;
        setServices(services);

        const cityList = await fetchCities();
        setCities(cityList);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    city: Yup.string().required('City is required'),
    vendorType: Yup.string().required('Vendor type is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(signupVendor(values));
      console.log(response.payload.vendor.redirectTo, "😘😘😘😘😘")
      if (response.payload.vendor && response.payload.vendor.redirectTo) {
        navigate(response.payload.vendor.redirectTo, { state: { email: values.email } });
      } else if (response.otpGenerated) {
        toast.success('OTP sent to your email');
        navigate('/vendor/otp-verification', { state: { email: values.email } });
      } else {
        toast.success('Signup success');
        navigate('/vendor/otp-verification', { state: { email: values.email } });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onCitySuggestionsFetchRequested = ({ value }) => {
    const filteredCities = cities.filter(city =>
      city.toLowerCase().includes(value.trim().toLowerCase())
    );
    setCitySuggestions(filteredCities);
  };

  const onCitySuggestionsClearRequested = () => {
    setCitySuggestions([]);
  };

  const getCitySuggestionValue = suggestion => suggestion;

  const renderCitySuggestion = suggestion => <div>{suggestion}</div>;

  const handleCityChange = (event, { newValue }) => {
    setCity(newValue);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Vendor Signup</h2>
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
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Autosuggest
                  suggestions={citySuggestions}
                  onSuggestionsFetchRequested={onCitySuggestionsFetchRequested}
                  onSuggestionsClearRequested={onCitySuggestionsClearRequested}
                  getSuggestionValue={getCitySuggestionValue}
                  renderSuggestion={renderCitySuggestion}
                  inputProps={{
                    value: city,
                    onChange: handleCityChange,
                    placeholder: 'Enter your city',
                    className: "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]",
                  }}
                  onSuggestionSelected={(event, { suggestionValue }) => {
                    setFieldValue('city', suggestionValue);
                  }}
                />
                <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  as="select"
                  name="vendorType"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
                >
                  <option value="" disabled>
                    {loading ? 'Loading services...' : 'Select your service type'}
                  </option>
                  {error ? (
                    <option disabled>{error}</option>
                  ) : (
                    services.map((service, index) => (
                      <option key={index} value={service}>
                        {service}
                      </option>
                    ))
                  )}
                </Field>
                <ErrorMessage name="vendorType" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4 mt-4">
                <Field
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-[#a39f74d6]"
                />
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                className="w-full px-4 py-2 bg-[#a39f74] text-white font-semibold rounded-lg shadow-md hover:bg-[#a39f74d6] focus:outline-none focus:border-[#a39f74d6]"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/vendor/login" className="text-[#a39f74] hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;
