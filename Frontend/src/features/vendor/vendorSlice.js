  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
  import axios from 'axios';
  import vendorService from './vendorService';
  import Cookies from 'js-cookie';
import axiosInstanceVendor from '../../services/axiosInstanceVenndor';

  // export const signupVendor = createAsyncThunk(
  //     'vendor/signupVendor',
  //     async (vendorData, { rejectWithValue }) => {
  //       try {
  //         const response = await axios.post('http://localhost:5000/api/vendor/signup', vendorData );
  //         console.log(response);
  //         return response.data; 
  //       } catch (error) {
  //         return rejectWithValue(error.response.data);
  //       }
  //     }
  //   );

  export const signupVendor = createAsyncThunk(
    'vendor/signup',
    async (vendorData, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/vendor/signup', vendorData);
        console.log(response.data,"vendor slice");
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue(error.message);
        }
      }
    }
  );
    export const loginVendor = createAsyncThunk(
      'vendor/loginVendor',
      async(vendorData, {rejectWithValue}) => {
          try {
              console.log('vendordata',vendorData);
              const response = await vendorService.loginVendor(vendorData)
              console.log(response.data.response.token,'👿');
              Cookies.set('tokenvendor',response.data.response.token.token)
              return response.data
          } catch (err) {
              if (!err.response) {
                throw err;
              }
              return rejectWithValue(err.response.data);
            }
      }
    )


    
    export const uploadLicense = createAsyncThunk(
      'vendor/uploadLicense',
      async (licenseData, { rejectWithValue }) => {
        try {
          console.log('License Data:', licenseData);
          const response = await vendorService.uploadLicense(licenseData);
          return response.data; 
        } catch (error) {
          console.error('Error uploading license:', error);
          return rejectWithValue(error.response.data); // Return error message
        }
      }
    );

    export const clearVendor = createAsyncThunk(
      'vendor/clearVendor',
      async (_, { dispatch }) => {
        dispatch(logoutVendor());
        Cookies.remove('tokenvendor');
      }
    );

    
export const checkAuth = createAsyncThunk(
  'vendor/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstanceVendor.post('/checkAuth');
      console.log(response);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
    
    

    const vendorSlice = createSlice({
      name:'vendor',
      initialState:{
          vendor:null,
          loading:false,
          error:null,
      },
      reducers: {
        setVendor(state, action) {
          state.vendor = action.payload;
        },
        logoutVendor(state) {
          state.vendor = null;
          state.loading = false;
          state.error = null;
        },
      },
      extraReducers:(builder) => {
          builder
          .addCase(signupVendor.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(signupVendor.fulfilled, (state, action) => {
            state.vendor = action.payload.vendor;
            state.loading = false;
          })
          .addCase(signupVendor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          .addCase(loginVendor.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(loginVendor.fulfilled, (state, action) => {
              state.loading = false;
              console.log("slice login",action);
              state.vendor = action.payload.response.vendor; 
              console.log(state,"vendor slice lin2-72");
            })
            .addCase(loginVendor.rejected, (state, action) => {
              console.log("slice login eeree",action);
              state.loading = false;
              state.error = action.payload ? action.payload.error : 'Login failed';
          })
          .addCase(uploadLicense.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(uploadLicense.fulfilled, (state, action) => {
            state.status = 'succeeded';
          })
          .addCase(uploadLicense.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
          })
          .addCase(clearVendor.fulfilled, (state) => {
            state.vendor = null;
          }); 
      
      }
    })

    export const { setVendor, logoutVendor } = vendorSlice.actions;

    export const selectVendor = (state) => state.vendor
    export default vendorSlice.reducer;
    