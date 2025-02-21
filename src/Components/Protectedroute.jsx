import React from 'react'
import Login from './Login'
import Home from './Home'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext';


function Protectedroute({children}) {
  
  const { isLoggedIn } = useAuth();
        if (isLoggedIn){
     return children
    }else{
      return  <Navigate to='/login' />
    }  
}

export default Protectedroute