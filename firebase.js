// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC96HPMvSsVR1sx2rH0MpzSBYFiYDKXDJ4",
  authDomain: "chatapp-df689.firebaseapp.com",
  projectId: "chatapp-df689",
  storageBucket: "chatapp-df689.firebasestorage.app",
  messagingSenderId: "1059566033754",
  appId: "1:1059566033754:web:e3a6ed7bdf231e6fdd7163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth}