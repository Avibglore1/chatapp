import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import pic from "../../public/gogglepic.png";

function Profile({ onBack, isOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={`absolute top-0 left-0 w-[35%] h-full bg-white z-20 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Profile Header */}
      <header className="bg-[#04a784] p-3 flex items-center gap-3">
        <button onClick={onBack}>
          <ArrowLeft className="text-white scale-x-120" strokeWidth={2} />
        </button>
        <h1 className="text-2xl text-white">Profile</h1>
      </header>

      {/* Profile Details */}
      <div className="p-6 mt-10 flex flex-col items-center">
        <img src={pic} className="w-52 h-52 rounded-full object-cover" alt="Profile" />
        <div className="mt-16 w-full">
          <p className="text-[#04a784] text-sm">Your name</p>
          <div className="flex justify-between items-center bg-white p-3 shadow-md">
            <p>Avinash Kumar</p>
            <Check />
          </div>
        </div>
        <div className="mt-4 w-full">
          <p className="text-[#04a784] text-sm mt-4">Status</p>
          <div className="flex justify-between items-center bg-white p-3 shadow-md">
            <p className="text-gray-500 text-sm">Update your status...</p>
            <Check />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col justify-center items-center mt-3">
        <button
          onClick={handleLogout}
          className="bg-[#04a784] text-white text-sm px-6 py-3 mt-6 rounded-md"
        >
          Logout
        </button>
      </div>
      
    </div>
  );
}

export default Profile;
