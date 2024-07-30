import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import { fetchCities, fetchServices } from '../services/cityService';
import Select from 'react-select'

const EditProfileModal = ({ isOpen, onRequestClose, vendor }) => {
  const [cities, setCities] = useState([]);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCities = await fetchCities();
        const fetchedServices = await fetchServices();
        setCities(fetchedCities);
        setServices(fetchedServices.map(service => ({ value: service, label: service })));
        setNewService(vendor.service?.map(service => ({ value: service, label: service })) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [vendor.service]);

  const formik = useFormik({
    initialValues: {
      name: vendor.name || '',
      city: vendor.city || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
        try {
            const updatedValues = {
              ...values,
              service: newService.map(service => service.value), // Extract only the values
            };
    
            console.log('Updated Values:', updatedValues);
    
            await axiosInstanceVendor.put(`/${vendor._id}`, updatedValues);
            onRequestClose();
            // Optionally, trigger a refresh of the vendor data here
          } catch (error) {
            console.error('Failed to update profile:', error);
          }
    },
  });

  const handleServiceChange = (selectedoptions) => {
    setNewService(selectedoptions)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Profile"
      className="relative w-full max-w-lg mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.name}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {formik.errors.name ? <div className="text-red-600 mt-1">{formik.errors.name}</div> : null}
        </div>
        <div>
          <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
          <select
            id="city"
            name="city"
            onChange={formik.handleChange}
            value={formik.values.city}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" label="Select city" />
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
          {formik.errors.city ? <div className="text-red-600 mt-1">{formik.errors.city}</div> : null}
        </div>
        <div>
          <label htmlFor="service" className="block text-gray-700 font-medium mb-2">Services</label>
          <Select
            id="service"
            isMulti
            options={services}
            value={newService}
            onChange={handleServiceChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-[#a39f74] text-white px-4 py-2 rounded-md hover:bg-[#98946d]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
