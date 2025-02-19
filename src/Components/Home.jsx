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
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
        setSelectedUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUserSelect = (user) => {
    if (!currentUserId || user.id === currentUserId) return;
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen relative">
      {/* Left Sidebar: Chat Panel */}
      <ChatPanel
        onProfileClick={() => setShowProfile(true)}
        onSelectUser={handleUserSelect}
        currentUserId={currentUserId}
      />

      {/* Overlay Profile Panel */}
      <Profile isOpen={showProfile} onBack={() => setShowProfile(false)} />

      {/* Right Section: Chat or EmptyChat */}
      <div className="flex-1">
        {selectedUser && currentUserId ? (
          <Chat user={selectedUser} currentUserId={currentUserId} onBack={() => setSelectedUser(null)} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}

export default Home;
