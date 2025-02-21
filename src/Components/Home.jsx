import React, { useState, useEffect } from "react";
import Profile from "./Profile";
import ChatPanel from "./ChatPanel";
import EmptyChat from "./EmptyChat";
import Chat from "./Chat";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Home() {
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        setCurrentUserId(user.uid);
      } else {
        console.log("User logged out");
        setCurrentUserId(null);
        setSelectedUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleProfileToggle = () => {
    setShowProfile(prev => !prev);
  };

  const handleUserSelect = (user) => {
    if (!currentUserId || user.id === currentUserId) return;
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen relative">
      {/* Left Sidebar: Chat Panel */}
      <ChatPanel
        onProfileClick={handleProfileToggle}
        onSelectUser={handleUserSelect}
        currentUserId={currentUserId}
      />

      {/* Profile Panel (Overlay) */}
      <Profile 
        isOpen={showProfile} 
        onBack={handleProfileToggle}
      />

      {/* Right Section: Chat or EmptyChat */}
      <div className="flex-1 flex">
        {selectedUser && currentUserId ? (
          <Chat
            user={selectedUser}
            currentUserId={currentUserId}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

export default Home;