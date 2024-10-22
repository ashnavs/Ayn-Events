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
import Select from 'react-select';

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
        const serviceResponse = await axios.get('https://ashna.site
/api/vendor/service-types');
        const services = serviceResponse.data;
        setServices(services.map(service => ({ label: service, value: service })));

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
    services: Yup.array().min(1, 'At least one service is required').required('Service is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await dispatch(signupVendor(values));
      console.log(response,"✅✅✅✅")
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
            services: [],
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
                <Select
                  isMulti
                  name="services"
                  options={services}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={selectedOptions => setFieldValue('services', selectedOptions.map(option => option.value))}
                />
                <ErrorMessage name="services" component="div" className="text-red-500 text-sm mt-1" />
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
                className="w-full px-4 py-2 text-lg font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:bg-gray-900"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
            </Form>
          )}
        </Formik>
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default VendorSignup;
