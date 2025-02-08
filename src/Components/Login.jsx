import React from 'react'
import { Fingerprint,LogIn  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';

function Login(props) {
  const navigate = useNavigate();
  const {setIsLoggedIn} = props;
  const login = async() =>{
    await signInWithPopup(auth, new GoogleAuthProvider);
    console.log('login');
    setIsLoggedIn(true);
    navigate('/')
  }
  return (
    <>
    <div className='relative bg-green-600 flex h-[40vh] items-center'>
      <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="dd" 
          className='absolute top-24 left-80 w-8'
      />
      <h1 className='absolute top-24 left-[160px] text-white'>WHATSAPP</h1>
    </div>
    <div className='relative w-full h-[60vh] -mt-[20vh]'>
      <div className='absolute md:w-[50%] h-[95%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white
      flex flex-col justify-center items-center shadow-2xl rounded-xl p-6'>
          <Fingerprint size={100} strokeWidth={2} className="text-gray-700" />
          <h2 className="text-lg font-semibold mt-5">Sign In</h2>
          <p className="text-center text-gray-400 text-sm mt-2">
            Sign in with your Google account <br /> to get started
           </p>
          <button onClick={login} className="mt-7 px-4 py-2 bg-green-600 text-white rounded flex items-center gap-3">
            Sign in with Google <LogIn />
          </button>
      </div>
    </div>
    </>
    
  )
}

export default Login