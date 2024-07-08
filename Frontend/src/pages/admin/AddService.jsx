import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import Sidebar from '../../components/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { addService } from '../../features/admin/adminslice';
import axiosInstance from '../../services/axiosInstance';
import Switch from 'react-switch';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const AddService = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const [services, setServices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', image: null, createdAt: '', isBlocked: false });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewService({ name: '', image: null, createdAt: '', isBlocked: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewService({ ...newService, image: e.target.files[0] });
  };

  const handleStatusChange = (checked) => {
    setNewService({ ...newService, isBlocked: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newService.name);
    if (newService.image) {
      formData.append('image', newService.image);
    }
    formData.append('isBlocked', newService.isBlocked);
    dispatch(addService(formData));
    closeModal();
  };

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get('http://localhost:5000/api/admin/get-services');
      console.log('API Response:', response.data); // Log API response
      setServices(response.data);
    } catch (err) {
      console.error('Failed to fetch services:', err.response ? err.response.data : err.message);
    }
  };

  const toggleBlockedStatus = async (serviceId) => {
    const service = services.find((service) => service._id === serviceId);
    const isBlocked = !service.isBlocked;
    try {
      await axiosInstance.patch(`/blockService/${serviceId}`, { is_active: isBlocked });
      setServices((prevServices) =>
        prevServices.map((s) =>
          s._id === serviceId ? { ...s, isBlocked } : s
        )
      );
    } catch (err) {
      console.error('Failed to update service status:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [admin]);

  console.log('Services:', services); // Log services state

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Service List</h2>

        <button
          onClick={openModal}
          className="mb-4 px-4 py-2 bg-[#a39f74] text-white rounded hover:bg-[#8b8866] focus:outline-none"
        >
          Add Service
        </button>

        <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Reg. At
                </th>
                <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 bg-gray-200 dark:bg-gray-800 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index}>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p className="text-gray-900 dark:text-white whitespace-no-wrap">{service.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                    {service.imageUrl && (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                    {new Date(service.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${!service.isBlocked ? 'text-green-900' : 'text-red-900'}`}>
                      <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${!service.isBlocked ? 'bg-green-200' : 'bg-red-200'}`}></span>
                      <span className="relative">{!service.isBlocked ? 'Active' : 'Blocked'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm">
                    <Switch
                      onChange={() => toggleBlockedStatus(service._id)}
                      checked={service.isBlocked}
                      onColor="#EF4444"
                      offColor="#A39F74"
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={20}
                      width={40}
                      borderRadius={10}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Add Service Modal"
        >
          <h2 className="text-xl font-bold mb-4">Add New Service</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={newService.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Status</label>
              <Switch
                onChange={handleStatusChange}
                checked={newService.isBlocked}
                onColor="#EF4444"
                offColor="#A39F74"
                uncheckedIcon={false}
                checkedIcon={false}
                height={20}
                width={40}
                borderRadius={10}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#a39f74] text-white rounded hover:bg-[#8b8866] focus:outline-none"
              >
                Add Service
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AddService;
