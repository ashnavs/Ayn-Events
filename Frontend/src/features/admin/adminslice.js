import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import adminService from './adminService';
import axiosInstance from '../../services/axiosInstance';

export const loginAdmin = createAsyncThunk(
  'admin/loginAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await adminService.adminLogin(adminData);
      Cookies.set('admintoken', response.response.token.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axios.get('https://ayn-events.onrender.com
/api/admin/userlist');
  return response.data;
});

export const toggleUserStatus = createAsyncThunk('admin/toggleUserStatus', async ({ userId, isBlocked }) => {
  const response = await axios.post('https://ayn-events.onrender.com
/api/admin/block-user', { userId, is_blocked: isBlocked });
  return response.data;
});


export const addService = createAsyncThunk('admin/addService', async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/addservice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const clearAdmin = createAsyncThunk(
  'admin/clearAdmin',
  async (_, { dispatch }) => {
    dispatch(logoutAdmin());
    Cookies.remove('admintoken');
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: [], 
    status: 'idle',
    error: null,
  },
  reducers: {
    logoutAdmin(state) {
      state.admin = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.admin = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.admin.findIndex((admin) => admin._id === action.payload._id);
        if (index !== -1) {
          state.admin[index] = action.payload;
        }
      })
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addService.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearAdmin.fulfilled, (state) => {
        state.admin = null;
      }); 
  
  },
});

export const { logoutAdmin } = adminSlice.actions;

export default adminSlice.reducer;
