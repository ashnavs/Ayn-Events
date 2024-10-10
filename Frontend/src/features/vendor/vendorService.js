import axios from 'axios';

const API_URL = 'https://ayn-events.onrender.com/api/vendor';

export const loginVendor = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response;
  };

export const uploadLicense = async (licenseData) => {
  console.log(licenseData,"🤣");
  const response = await axios.post(`${API_URL}/uploadlicense`, licenseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

  const vendorService = {
    loginVendor,
    uploadLicense
  };

  export default vendorService;