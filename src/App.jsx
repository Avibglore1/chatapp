import './App.css'
import { Routes,Route } from 'react-router-dom'
import Login from './Components/Login'
import Home from './Components/Home'
import Chat from './Components/Chat'
import PageNotFound from './Components/PageNotFound'

function App() {
  return (
    <>
      
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/login' element={<Home />}/>
        <Route path='/chat/:chatid' element={<Chat />}/>
        <Route path='*' element={<PageNotFound />}/>
      </Routes>
    </>
  )
}

export default App
