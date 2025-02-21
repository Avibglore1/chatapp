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
    console.log("Home component mounted!");

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

    return () => {
      console.log("Cleanup: Unsubscribing from auth listener");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log("showProfile state changed:", showProfile);
  }, [showProfile]);

  const handleUserSelect = (user) => {
    if (!currentUserId || user.id === currentUserId) return;
    console.log("User selected:", user);
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar: Chat Panel */}
      <ChatPanel
        onProfileClick={() => {
          console.log("Profile button clicked!");
          setShowProfile(true);
        }}
        onSelectUser={handleUserSelect}
        currentUserId={currentUserId}
      />

      {/* Overlay Profile Panel */}
      {showProfile && (
        <>
          <p>Profile Component Should Be Here</p>
          <Profile onClose={() => setShowProfile(false)} />
        </>
      )}

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
