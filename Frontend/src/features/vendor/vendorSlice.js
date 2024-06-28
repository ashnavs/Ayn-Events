import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import vendorService from './vendorService';
import Cookies from 'js-cookie';


export const signupVendor = createAsyncThunk(
    'vendor/signupVendor',
    async (vendorData, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/vendor/signup', vendorData );
        console.log(response);
        return response.data; 
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

  export const loginVendor = createAsyncThunk(
    'vendor/loginVendor',
    async(vendorData, {rejectWithValue}) => {
        try {
            console.log('vendordata',vendorData);
            const response = await vendorService.loginVendor(vendorData)
            Cookies.set('vendortoken',response.token)
            return response.data
        } catch (err) {
            if (!err.response) {
              throw err;
            }
            return rejectWithValue(err.response.data);
          }
    }
  )


  const vendorSlice = createSlice({
    name:'vendor',
    initialState:{
        vendor:null,
        loading:false,
        error:null,
    },
    reducers:{ },
    extraReducers:(builder) => {
        builder
        .addCase(loginVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginVendor.fulfilled, (state, action) => {
            state.loading = false;
            console.log("slice login",action);
            state.vendor = action.payload.response.vendor; 
          })
          .addCase(loginVendor.rejected, (state, action) => {
            console.log("slice login eeree",action);
            state.loading = false;
            state.error = action.payload ? action.payload.error : 'Login failed';
        })
    
    }
  })

  export const selectVendor = (state) => state.vendor
  export default vendorSlice.reducer;
  