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

  const navigate = useNavigate()

  // console.log(user)

  const userStatus=async() =>{
    const res = await axiosInstanceUser.get(`/getStatus?id=${user.id}`)
    console.log(res.data)
    console.log(res.data.response)
    if(res.data.response.is_blocked){
      
      navigate('/login')

    }
  } 
  useEffect(()=>{
    userStatus()
  },[])
  



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
