import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import pic from "../../public/gogglepic.png";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

function Profile({ onBack, isOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();
 
  const handleLogout = async () => {
    try {  
      await signOut(auth);
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Theme colors
  const primaryColor = theme === "dark" ? "#059669" : "#04a784";
  
  return (
    <div
      className={`fixed top-0 left-0 w-[30%] h-full z-20 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Profile Header */}
      <header 
        className="px-4 py-3 flex items-center gap-3"
        style={{ backgroundColor: primaryColor }}
      >
        <button onClick={onBack} className="flex items-center justify-center">
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-medium text-white">Profile</h1>
      </header>

      {/* Profile Details */}
      <div className="p-6 flex flex-col items-center">
        <div className="w-36 h-36 rounded-full bg-gray-500 flex items-center justify-center mb-12 mt-24">
          <span className="text-white text-6xl font-light">A</span>
        </div>
        
        <div className="w-full mb-6">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Your name</p>
          <div className={`flex justify-between items-center p-3 ${
            theme === "dark" 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-gray-100"
          }`}>
            <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
              Avinash Kumar
            </p>
            <Check size={20} style={{ color: primaryColor }} />
          </div>
        </div>
        
        <div className="w-full mb-12">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Status</p>
          <div className={`flex justify-between items-center p-3 ${
            theme === "dark" 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-gray-100"
          }`}>
            <p className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              Update your status...
            </p>
            <Check size={20} style={{ color: primaryColor }} />
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto mb-8 flex justify-center w-full">
          <button
            onClick={handleLogout}
            style={{ backgroundColor: primaryColor }}
            className="text-white font-medium py-2 px-8 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;