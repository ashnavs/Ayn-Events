import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import './index.css'
import UserRoutes from './routes/userRoutes/UserRoutes';
import AdminRoutes from './routes/adminRoutes/AdminRoutes';
import VendorRoutes from './routes/vendorRoutes/VendorRoutes';





function App() {
  return (
    
      <Routes>
        <Route path='/*' element={<UserRoutes/>} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/vendor/*' element={<VendorRoutes/>} />
      </Routes>
      // <Toaster position="top-right" />
   
  );
}

export default App;
App.jsx

