import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import {signOut } from "firebase/auth"; // Import Firebase auth functions
import {auth} from "./../../firebase"
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import pic from "./../../public/gogglepic.png";

function Profile({ onBack }) { 
  
  const navigate = useNavigate(); // Get navigate function

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      console.log("User logged out successfully");
      navigate("/login"); // Navigate to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <header className="bg-[#04a784] p-3">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button onClick={onBack}>
            <ArrowLeft className="text-white scale-x-120" strokeWidth={2} />
          </button>
          <h1 className="text-2xl text-white">Profile</h1>
        </div>
      </header>

      <div className="bg-gray-200 h-[80vh] flex flex-col justify-center">
        {/* Profile Picture */}
        <div className="flex justify-center items-center h-[40vh]">
          <img src={pic} className="w-36 h-36 rounded-full object-cover" alt="Profile" />
        </div>

        {/* Name Section */}
        <div className="bg-white shadow-md p-3 mb-6 space-y-2">
          <p className="text-[#04a784] text-sm">Your name</p>
          <div className="flex justify-between items-center">
            <p>Avinash Kumar</p>
            <Check />
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white shadow-md p-3 mb-6 space-y-2">
          <p className="text-[#04a784] text-sm">Status</p>
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">Update your status...</p>
            <Check />
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout} 
          className="bg-[#04a784] text-white text-sm px-4 py-2 self-center rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
