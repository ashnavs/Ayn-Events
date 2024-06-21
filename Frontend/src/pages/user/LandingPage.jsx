import React from 'react'
import { Link } from 'react-router-dom'
import About from '../../components/About'
import HeaderLand from '../../components/HeaderLand'
import Celebrations from '../../components/Celebrations'
import Vendors from '../../components/Vendors'
import Footer from '../../components/Footer'


function LandingPage() {
  return (
    <div>
      <h1> <Link to='/signup'>SignUp</Link> </h1>
      <h1> <Link to='/login'>Login</Link></h1>
      <HeaderLand/>
      <About/>
      <Vendors/>
      <Celebrations/>
      <Footer/>
    </div>
  )
}

export default LandingPage
