

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import authService from './authService';

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', userData );
      return response.data; // Ensure this contains the user object with email
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const GoogleAuth = createAsyncThunk(
  'auth/GoogleAuth',
  async (userData, { rejectWithValue }) => {
    console.log("/./././././",userData);
    try {
      const response = await axios.post('http://localhost:5000/api/users/googleAuth', userData );
      return response.data; // Ensure this contains the user object with email
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async(userData, {rejectWithValue}) => {
    try {
      const response = await authService.login(userData)
      // if(userData.is_blocked === true){
      //   throw new Error('Account is blocked')
      // }
      console.log('sliceee');
      return response.data;
    } catch (error) {
      console.log("mnmnnmnmnmnm",error);
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async(adminData, {rejectWithValue}) => {
    try {
      const response = await authService.adminLogin(adminData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null; // Resets the error state to null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Ensure this sets the user with email
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Assuming your response structure includes a user object
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("slice login eeree",action);
        state.loading = false;
        state.error = action.payload ? action.payload.message : 'Login failed';
      })
      .addCase(GoogleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GoogleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(GoogleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
