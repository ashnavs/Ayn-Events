import React from 'react';
import './App.css';
import { BrowserRouter as Router , Route, Routes } from 'react-router-dom';
import Signup from './pages/user/Signup';
import LangingPage from './pages/user/LangingPage';
import UserOtp from './pages/user/UserOtp';
import { Toaster } from 'sonner';
import LoginPage from './pages/user/LoginPage';
import UserHomePage from './pages/user/UserHomePage';
import './GlobalStyles.scss'
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';

function App() {
  return (
    
    <Router>  
      <Routes>
        <Route path='/' element={<LangingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/otp-verification/:email' element={<UserOtp/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/home' element={<UserHomePage/>}/>

       { /* adminroutes */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/dashboard' element={<Dashboard/>}/>
        <Route path='/admin/userlist' element={<UserList/>}/>


      </Routes>
    </Router>
  )
}

export default App;
