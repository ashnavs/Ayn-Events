import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vendor';

export const loginVendor = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    // console.log("login service response",response);
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