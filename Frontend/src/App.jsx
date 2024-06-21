import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './GlobalStyles.scss'
import './index.css'
import UserRoutes from './Routes/UserRoutes';


function App() {
  return (
    
      <Routes>
        <Route path='/*' element={<UserRoutes/>} />
        {/* <Route path='/admin' element={<adminRoutes />} /> */}
      </Routes>
      // <Toaster position="top-right" />
   
  );
}

export default App;
App.jsx

