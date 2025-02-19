import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Home from './Components/Home';
import Chat from './Components/Chat';
import PageNotFound from './Components/PageNotFound';
import { useState, useEffect } from 'react';
import Protectedroute from './Components/Protectedroute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true"; // Get from storage
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/' element={
          <Protectedroute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
            <Home setIsLoggedIn={setIsLoggedIn} />
          </Protectedroute>
        }/>
        <Route path='/chat/:chatid' element={
          <Protectedroute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
            <Chat isLoggedIn={isLoggedIn} />
          </Protectedroute>
        }/>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
