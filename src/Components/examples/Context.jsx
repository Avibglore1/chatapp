import React, { useContext } from 'react'
import PageNotFound from '../PageNotFound';
import Article from './Article';
import {Routes,Route} from 'react-router-dom'

const bg = 'bg-yellow-500'
 const contextWrapper = React.createContext();
function Context() {
   
  return (
    <>
    <div className='text-8xl'>Themebased</div>  
    <contextWrapper.Provider value={bg}>
        <Routes>
            <Route path='/' element = {<Article></Article>}></Route>
            <Route path='*' element = {<PageNotFound></PageNotFound>}></Route>
        </Routes>
    </contextWrapper.Provider>
       
    </>
    
  )
}



export default Context
export {contextWrapper}