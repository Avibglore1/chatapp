import React, { useContext } from 'react'
import { contextWrapper } from './Context'
function Header() {
    const bgcolor = useContext(contextWrapper);
  return (
    <div className={`text-blue-300 text-3xl ${bgcolor}`}>Header</div>
  )
}

export default Header