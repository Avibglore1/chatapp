import React from 'react'
import { useParams } from 'react-router-dom'
function Chat() {
    const chatid = useParams().chatid;
  return (
    <div>Chat {chatid}</div>
  )
}

export default Chat