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
    borderRadius: '10px',
    padding: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f8f8',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const AddService = () => {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.admin);
  const [services, setServices] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', image: null, createdAt: '', isBlocked: false });
  const [serviceToToggle, setServiceToToggle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNewService({ name: '', image: null, createdAt: '', isBlocked: false });
  };

  const openConfirmModal = (service) => {
    setServiceToToggle(service);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
    setServiceToToggle(null);
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
      const response = await axiosInstance.get(`https://ayn-events.onrender.com/api/admin/get-services?page=${currentPage}&limit=${limit}`);
      console.log('API Response:', response.data);
      setServices(response.data.services); 
      setTotalPages(response.data.totalPages); 
    } catch (err) {
      console.error('Failed to fetch services:', err.response ? err.response.data : err.message);
    }
  };


  const confirmToggleBlockedStatus = async () => {
    if (serviceToToggle) {
      const isBlocked = !serviceToToggle.isBlocked;
      try {
        await axiosInstance.patch(`/blockService/${serviceToToggle._id}`, { is_active: isBlocked });
        setServices((prevServices) =>
          prevServices.map((s) =>
            s._id === serviceToToggle._id ? { ...s, isBlocked } : s
          )
        );
        closeConfirmModal();
      } catch (err) {
        console.error('Failed to update service status:', err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    console.log('Changing page to:', newPage); 
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage); 
    }
  };


  useEffect(() => {
    fetchServices();
  }, [currentPage, admin]); 

  return (
    <div className="flex bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Service List</h2>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-[#a39f74] text-white rounded hover:bg-[#8b8866] focus:outline-none"
          >
            Add Service
          </button>
        </div>

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
                      onChange={() => openConfirmModal(service)}
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

        <div className="flex justify-center mt-4">
          <button
            className={`mx-1 px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#a39f74] hover:bg-[#c0ba7e]'} text-white`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`mx-1 px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#a39f74] hover:bg-[#c0ba7e]'} text-white`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>

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

        <Modal
          isOpen={confirmModalIsOpen}
          onRequestClose={closeConfirmModal}
          style={customStyles}
          contentLabel="Confirmation Modal"
        >
          <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
          {serviceToToggle && (
            <p className="mb-4">
              {serviceToToggle.isBlocked
                ? `Are you sure you want to unblock the service "${serviceToToggle.name}"?`
                : `Are you sure you want to block the service "${serviceToToggle.name}"?`}
            </p>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmToggleBlockedStatus}
              className="px-4 py-2 bg-[#a39f74] text-white rounded hover:bg-[#8e8b6a] focus:outline-none"
            >
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AddService;
