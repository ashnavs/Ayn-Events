import React from 'react'
import { Link } from 'react-router-dom'

function LangingPage() {
  return (
    <div>
      <h1> <Link to='/signup'>SignUp</Link> </h1>
      <h1> <Link to='/login'>Login</Link></h1>
    </div>
  )
}

export default LangingPage
