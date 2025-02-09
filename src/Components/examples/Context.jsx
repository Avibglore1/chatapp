import React, { useContext } from 'react'
import GrandParent from './GrandParent';

const value=10;
 const contextWrapper = React.createContext();
function Context() {
   
  return (
    <>
        <div>Context</div>  
        <contextWrapper.Provider value={value}>
        <GrandParent></GrandParent>
        </contextWrapper.Provider>
        
    </>
    
  )
}



export default Context
export {contextWrapper}