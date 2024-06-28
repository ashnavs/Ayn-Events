import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vendor';

export const loginVendor = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    console.log("login service response",response.data);
    return response;
  };

  const vendorService = {
    loginVendor
  };


  export default vendorService;