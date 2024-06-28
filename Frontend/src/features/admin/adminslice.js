import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios'
import Cookies from 'js-cookie';
import adminService from './adminService';

export const loginAdmin = createAsyncThunk(
    'admin/loginAdmin',
    async(adminData, {rejectWithValue}) => {
      try {
        const {response} = await adminService.adminLogin(adminData)
        console.log(response)

        Cookies.set('admintoken',response.token)
        return response
      } catch (error) {
        return rejectWithValue(error.response.data)
      }
    }
  )

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
  const response = await axios.get('http://localhost:5000/api/admin/userlist');
  return response.data;
});

export const toggleUserStatus = createAsyncThunk('admin/toggleUserStatus', async ({ userId, isBlocked }) => {
  const response = await axios.post('http://localhost:5000/api/admin/block-user', { userId, is_blocked: isBlocked });
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admin: [],
      status: 'idle',
      error: null
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
        .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        })
        .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload)
        state.admin = action.payload;
        })
        .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        console.log(action.payload)
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
              const index = state.users.findIndex(admin => admin._id === action.payload._id);
              if (index !== -1) {
                  state.admin[index] = action.payload;
              }
          });
  }
});

export default adminSlice.reducer;
