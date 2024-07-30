import React from 'react';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstanceVendor from '../services/axiosInstanceVenndor';
import { useSelector } from 'react-redux';
import { selectVendor } from '../features/vendor/vendorSlice';

const CreatePostModal = ({ isOpen, onRequestClose }) => {
  const vendor = useSelector(selectVendor);

  const formik = useFormik({
    initialValues: {
      description: '',
      image: null,
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .max(500, 'Description must be 500 characters or less')
        .required('Description is required'),
      image: Yup.mixed()
        .required('Image is required')
        .test('fileSize', 'File size is too large', value => value && value.size <= 2 * 1024 * 1024) // 2MB
        .test('fileType', 'Unsupported file type', value =>
          value ? ['image/jpeg', 'image/png', 'image/gif'].includes(value.type) : false
        ),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('description', values.description);
      formData.append('image', values.image);
      formData.append('vendorId', vendor.vendor.id);

      try {
        const response = await axiosInstanceVendor.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Post created successfully:', response.data);
        formik.resetForm();
        onRequestClose();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <div className="p-4">
        <h2 className="text-2xl mb-4">Create Post</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.description && formik.errors.description ? 'border-red-500' : ''
              }`}
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
            />
            {formik.touched.description && formik.errors.description ? (
              <p className="text-red-500 text-xs italic">{formik.errors.description}</p>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              type="file"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formik.touched.image && formik.errors.image ? 'border-red-500' : ''
              }`}
              id="image"
              name="image"
              onChange={(event) => {
                formik.setFieldValue('image', event.currentTarget.files[0]);
              }}
              onBlur={formik.handleBlur}
            />
            {formik.touched.image && formik.errors.image ? (
              <p className="text-red-500 text-xs italic">{formik.errors.image}</p>
            ) : null}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#a39f74] hover:bg-[#93906b] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onRequestClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
