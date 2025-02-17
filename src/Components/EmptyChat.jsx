import React from 'react'
import { MessageSquareText } from 'lucide-react';
function EmptyChat() {
  return (
    <>
    <main className="bg-gray-200 flex-1 flex flex-col justify-center items-center">
      <MessageSquareText className='text-gray-400' size={96}/>
      <p className=''>select any contact to start a chat with</p>
    </main>
    </>
    
  )
}

export default EmptyChat