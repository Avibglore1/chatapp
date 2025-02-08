import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function Home(props) {
  const navigate = useNavigate();
  const {setIsLoggedIn} = props;
  const logout = async() =>{
    await signOut(auth);
    console.log('logout');
    setIsLoggedIn(false);
    navigate('/login');
  }
  return (
    <>
      <div>Home</div>
      <button onClick={logout} className='rounded-lg bg-slate-200 px-3 py-2'>Logout</button>
    </>
    
  )
}

export default Home