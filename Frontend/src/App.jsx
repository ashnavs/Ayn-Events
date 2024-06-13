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

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path='/' element={<LangingPage/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/otp-verification/:email' element={<UserOtp/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/home' element={<UserHomePage/>}/>
        

      </Routes>
    </Router>
  )
}

export default App;
