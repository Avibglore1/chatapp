import React, { useState } from "react";
import Profile from "./Profile";
import ChatPanel from "./ChatPanel";
import EmptyChat from "./EmptyChat";
import Chat from "./Chat"; // Import the Chat component
import pic from "./../../public/gogglepic.png";

function Home(props) {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // State to track selected user

  return (
    <div className="flex">
      {/* Toggle between ChatPanel and Profile */}
      {showProfile ? (
        <Profile onBack={() => setShowProfile(false)} />
      ) : (
        <ChatPanel 
          onProfileClick={() => setShowProfile(true)} 
          onSelectUser={(user) => setSelectedUser(user)} // Pass the function
        />
      )}

      {/* Chat Window */}
      <div className="w-[70%] h-screen flex flex-col">
        <header>
          <div className="bg-gray-200 flex flex-row justify-start items-center gap-1 h-16 px-4">
            <img src={pic} className="w-10 h-10 rounded-full object-cover" alt="" />
            <p>Avinash Kumar</p>
          </div>
        </header>

        {/* Toggle between EmptyChat and Chat */}
        {selectedUser ? <Chat user={selectedUser} /> : <EmptyChat />}
      </div>
    </div>
  );
}

export default Home;
