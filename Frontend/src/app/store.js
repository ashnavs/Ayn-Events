import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '../features/auth/authSlice';
import adminReducer from '../features/admin/adminslice';
import vendorReducer from '../features/vendor/vendorSlice';
import chatReducer from '../features/chat/chatSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
};

const adminPersistConfig = {
  key: 'admin',
  storage,
}; 

const vendorPersistConfig = {
  key: 'vendor',
  storage,
};

const chatPersistConfig = { 
  key: 'chat',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);
const persistedVendorReducer = persistReducer(vendorPersistConfig, vendorReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer); 


const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  admin: persistedAdminReducer,
  vendor: persistedVendorReducer,
  chat: persistedChatReducer, 
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
