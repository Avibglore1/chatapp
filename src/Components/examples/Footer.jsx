import React, { useContext } from 'react'
import { contextWrapper } from './Context'


function Footer() {
    const color = useContext(contextWrapper)
  return (
    <div className={`text-gray-400 text-5xl ${color}`}>Footer</div>
  )
}

export default Footer