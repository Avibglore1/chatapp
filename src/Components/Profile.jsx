import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Edit } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

function Profile({ onBack, isOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Listen to Auth State
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        const userDoc = doc(db, "users", user.uid);
        
        // Fetch user data & listen for updates
        const unsubscribeFirestore = onSnapshot(userDoc, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || "");
            setStatus(data.status || "");

            // Save to local storage
            localStorage.setItem("userData", JSON.stringify(data));
          }
        });

        return () => unsubscribeFirestore();
      } else {
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userData");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Save Name
  const handleSaveName = async () => {
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { name }, { merge: true });

      // Save locally
      localStorage.setItem("userData", JSON.stringify({ name, status }));
    }
    setIsEditingName(false);
  };

  // Save Status
  const handleSaveStatus = async () => {
    if (currentUser) {
      await setDoc(doc(db, "users", currentUser.uid), { status }, { merge: true });

      // Save locally
      localStorage.setItem("userData", JSON.stringify({ name, status }));
    }
    setIsEditingStatus(false);
  };

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      navigate("/login");

      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("userData");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const primaryColor = theme === "dark" ? "#059669" : "#04a784";

  return (
    <div
      className={`fixed top-0 left-0 w-[30%] h-full z-20 shadow-lg transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      <header className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
        <button onClick={onBack} className="flex items-center justify-center">
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-xl font-medium text-white">Profile</h1>
      </header>

      <div className="p-6 flex flex-col items-center">
        <div className="w-36 h-36 rounded-full bg-gray-500 flex items-center justify-center mb-12 mt-24">
          <span className="text-white text-6xl font-light">{name ? name.charAt(0).toUpperCase() : "A"}</span>
        </div>

        {/* Name Input */}
        <div className="w-full mb-6">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Your Name</p>
          <div className={`flex justify-between items-center p-3 border ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100"
          }`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              readOnly={!isEditingName}
              className={`w-full focus:outline-none ${
                theme === "dark" ? "text-white bg-gray-800" : "text-gray-800 bg-gray-100"
              } ${isEditingName ? "border-b border-gray-400" : ""}`}
            />
            <button onClick={isEditingName ? handleSaveName : () => setIsEditingName(true)}>
              {isEditingName ? (
                <Check size={20} style={{ color: primaryColor }} />
              ) : (
                <Edit size={20} style={{ color: primaryColor }} />
              )}
            </button>
          </div>
        </div>

        {/* Status Input */}
        <div className="w-full mb-12">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Status</p>
          <div className={`flex justify-between items-center p-3 border ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100"
          }`}>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              readOnly={!isEditingStatus}
              className={`w-full focus:outline-none ${
                theme === "dark" ? "text-white bg-gray-800" : "text-gray-800 bg-gray-100"
              } ${isEditingStatus ? "border-b border-gray-400" : ""}`}
            />
            <button onClick={isEditingStatus ? handleSaveStatus : () => setIsEditingStatus(true)}>
              {isEditingStatus ? (
                <Check size={20} style={{ color: primaryColor }} />
              ) : (
                <Edit size={20} style={{ color: primaryColor }} />
              )}
            </button>
          </div>
        </div>

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
