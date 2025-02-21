import React from "react";
import { ArrowLeft, Check } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import pic from "../../public/gogglepic.png";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext"; // Import the theme context

function Profile({ onBack, isOpen }) {
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme(); // Get current theme
  
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
  const primaryColor = theme === "dark" ? "#059669" : "#04a784"; // Darker green for dark mode
  
  return (
    <div
      className={`absolute top-0 left-0 w-[30%] h-full z-20 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      {/* Profile Header */}
      <header 
        className={`p-3 flex items-center gap-3`}
        style={{ backgroundColor: primaryColor }}
      >
        <button onClick={onBack}>
          <ArrowLeft className="text-white scale-x-120" strokeWidth={2} />
        </button>
        <h1 className="text-2xl text-white">Profile</h1>
      </header>

      {/* Profile Details */}
      <div className="p-6 mt-10 flex flex-col items-center">
        <img src={pic} className="w-52 h-52 rounded-full object-cover" alt="Profile" />
        <div className="mt-16 w-full">
          <p style={{ color: primaryColor }} className="text-sm">Your name</p>
          <div className={`flex justify-between items-center p-3 ${
            theme === "dark" 
              ? "bg-gray-800 shadow-lg" 
              : "bg-white shadow-md"
          }`}>
            <p className={theme === "dark" ? "text-white" : "text-black"}>
              Avinash Kumar
            </p>
            <Check color={primaryColor} />
          </div>
        </div>
        <div className="mt-4 w-full">
          <p style={{ color: primaryColor }} className="text-sm mt-4">Status</p>
          <div className={`flex justify-between items-center p-3 ${
            theme === "dark" 
              ? "bg-gray-800 shadow-lg" 
              : "bg-white shadow-md"
          }`}>
            <p className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
              Update your status...
            </p>
            <Check color={primaryColor} />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col justify-center items-center mt-3">
        <button
          onClick={handleLogout}
          style={{ backgroundColor: primaryColor }}
          className="text-white text-sm px-6 py-3 mt-6 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;