import React, { useContext } from 'react'
import { contextWrapper } from './Context';
function Child() {
    const message= useContext(contextWrapper);
  return (
    <>
        <div>Child</div>
        <div>value :{message}</div>
    </>
    
  )
}

export default Child