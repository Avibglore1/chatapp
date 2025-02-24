import {getFirestore} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
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
const db = getFirestore(app)
const auth = getAuth(app);
const storage = getStorage(app);
export {db,auth,storage}