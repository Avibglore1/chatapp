import React from 'react'
import { Fingerprint,LogIn  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth,db } from '../../firebase';
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { setDoc,doc } from "firebase/firestore";
import { useAuth } from './AuthContext';

async function createUser(authData){
  const userObj = authData.user;
  const id= userObj.uid;
  const name = userObj.displayName;
  const profile_pic = userObj.photoURL;
  await setDoc(doc(db, "users",id), {
    id,
    name: name,
    profile_pic: profile_pic
  });
}
function Login(props) {
  const navigate = useNavigate();
  const {login} = useAuth();
  const loginClick = async() =>{
    const result = await signInWithPopup(auth, new GoogleAuthProvider);
    console.log('Logged In');
    createUser(result);
    login();
    navigate('/')
  }
  return (
    <div className="relative w-full h-[100vh]">
      <div className="bg-[#04a784] h-[40vh] w-full"></div>
      <div className="bg-[#eff2f5] h-[60vh] w-full"></div>
      <div className="absolute md:w-[50%] h-[60vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      bg-white flex flex-col justify-center items-center shadow-2xl rounded-xl p-6">
        <div className="flex items-center gap-3 absolute -top-24 -left-52">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
            alt="WhatsApp Logo" 
            className="w-8"
          />
          <h1 className="text-white text-2xl font-semibold">WHATSAPP</h1>
        </div>
        <Fingerprint size={100} strokeWidth={2} className="text-gray-700" />
        <h2 className="text-lg font-semibold mt-5">Sign In</h2>
        <p className="text-center text-gray-400 text-sm mt-2">Sign in with your Google account <br /> to get started</p>
        <button onClick={loginClick} className="mt-7 px-4 py-2 bg-[#04a784] text-white rounded flex items-center gap-3">
          Sign in with Google <LogIn />
        </button>
      </div>
    </div>    
  )
}

export default Login