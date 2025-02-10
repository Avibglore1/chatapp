import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {storage} from './../../firebase';
import { ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';

function Home(props) {
  const navigate = useNavigate();
  const {setIsLoggedIn} = props;
  const logout = async() =>{
    await signOut(auth);
    console.log('logout');
    setIsLoggedIn(false);
    navigate('/login');
  }

  const handleChange = (e) =>{
   const image= e.target.files[0];
   const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("File available at:", downloadURL);
      }
    );
  }
  return (
    <>
      <div>Home</div>
      <input type='file' accept='image/jpeg, image/png, image/webp' onChange={handleChange}/>
      <button onClick={logout} className='rounded-lg bg-slate-200 px-3 py-2'>Logout</button>
    </>
    
  )
}

export default Home