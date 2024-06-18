import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import getUsers from './adminService';
import axios from 'axios'

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
      users: [],
      status: 'idle',
      error: null
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
          .addCase(fetchUsers.pending, (state) => {
              state.status = 'loading';
          })
          .addCase(fetchUsers.fulfilled, (state, action) => {
              state.status = 'succeeded';
              state.users = action.payload;
          })
          .addCase(fetchUsers.rejected, (state, action) => {
              state.status = 'failed';
              state.error = action.error.message;
          })
          .addCase(toggleUserStatus.fulfilled, (state, action) => {
              const index = state.users.findIndex(user => user._id === action.payload._id);
              if (index !== -1) {
                  state.users[index] = action.payload;
              }
          });
  }
});

export default adminSlice.reducer;
