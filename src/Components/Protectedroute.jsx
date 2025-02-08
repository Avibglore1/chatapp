import React from 'react'
import Login from './Login'
import Home from './Home'
import { Navigate, useNavigate } from 'react-router-dom'


function Protectedroute(props) {
  
    const {isLoggedIn, children } = props
        if (isLoggedIn){
     return children
    }else{
      return  <Navigate to='/login' />
    }
    
}

export default Protectedroute