import React from 'react'
import Parent from './Parent'
function GrandParent() {
  return (
    <>
        <div>GrandParent</div>
        <Parent></Parent>
    </>
    
  )
}

export default GrandParent