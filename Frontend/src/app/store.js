// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
// import adminReducer from '../features/admin/adminslice'
// import vendorReducer from '../features/vendor/vendorSlice'

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     admin:adminReducer,
//     vendor:vendorReducer,
//   },
// });

// export default store;



import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminslice';
import vendorReducer from '../features/vendor/vendorSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';


const authPersistConfig = {
  key: 'auth',
  storage
};

const adminPersistConfig = {
  key: 'admin',
  storage
};

const vendorPersistConfig = {
  key: 'vendor',
  storage
};


const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedVendorReducer = persistReducer(vendorPersistConfig, vendorReducer);


const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  admin: persistedAdminReducer,
  vendor: persistedVendorReducer,
});


const store = configureStore({
  reducer: rootReducer,
});


const persistor = persistStore(store);

export { store, persistor };
