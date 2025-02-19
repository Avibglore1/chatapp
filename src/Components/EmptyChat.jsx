import React from 'react';
import { MessageSquareText } from 'lucide-react';

function EmptyChat() {
  return (
    <div className="flex flex-col h-full">
      {/* Empty Header (Same Style as Chat Header, but without content) */}
      <header className="bg-gray-200 flex items-center shadow-sm p-8"></header>

      {/* Message Icon & Text Taking Up Bottom Right Space */}
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="flex flex-col items-center text-gray-400">
          <MessageSquareText size={96} />
          <p className="text-center mt-2 text-gray-500">Select any contact to start a chat with</p>
        </div>
      </div>
    </div>
  );
}

export default EmptyChat;
