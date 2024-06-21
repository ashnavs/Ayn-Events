import axios from "axios";

const API_URL = 'http://localhost:5000/api/admin';

const adminLogin = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL_Admin}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error.response ? error.response.data : new Error('Server Error');
    }
  };

const getUsers = async()=>{
    try {
        const response = await axios.get(`${API_URL}/userlist`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:',error)
        throw error
    }
}

export default {getUsers}