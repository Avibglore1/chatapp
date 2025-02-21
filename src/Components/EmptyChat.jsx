import React from 'react';
import { useTheme } from './ThemeContext';

function EmptyChat() {
  const { theme } = useTheme(); // Move this inside the component function
  
  return (
    <div className={`flex flex-col items-center justify-center h-full flex-1 ${
      theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-600"
    }`}>
      <div className="text-center p-8">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <h2 className={`text-xl font-semibold mb-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>Select a conversation</h2>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
          Choose a contact from the left panel to start chatting
        </p>
      </div>
    </div>
  );
}

export default EmptyChat;