import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import HeroBanner from '../../components/HeroBanner'
import VendorCategory from '../../components/VendorCategory'
import VendorsFound from '../../components/VendorsFound'
import Footer from '../../components/Footer'
import axiosInstanceUser from '../../services/axiosInstanceUser'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


function UserHomePage() {
  const user = useSelector((state) => state.auth.user);
  console.log(user,"😒");
  const navigate = useNavigate()




  
  



  return (
    <div>
      <Header/>
      <HeroBanner/>
      <VendorCategory/>
      <VendorsFound/>
      <Footer/>
    </div>
  )
}

export default UserHomePage
