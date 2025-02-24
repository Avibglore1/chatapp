import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Camera } from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Profile({ onBack, isOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme } = useTheme();

  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

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
            setStatus(data.status || "Busy");
            if (data.profilePic) setImage(data.profilePic); // Set profile image
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

  // Save Name with feedback
  const handleSaveName = async () => {
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.uid), { name }, { merge: true });
        // Save locally
        localStorage.setItem("userData", JSON.stringify({ name, status }));
        
        // Show success feedback
        setNameSuccess(true);
        setTimeout(() => {
          setNameSuccess(false);
        }, 1500);
      } catch (error) {
        console.error("Error saving name:", error);
      }
    }
  };

  // Save Status with feedback
  const handleSaveStatus = async () => {
    if (currentUser) {
      try {
        await setDoc(doc(db, "users", currentUser.uid), { status }, { merge: true });
        // Save locally
        localStorage.setItem("userData", JSON.stringify({ name, status }));
        
        // Show success feedback
        setStatusSuccess(true);
        setTimeout(() => {
          setStatusSuccess(false);
        }, 1500);
      } catch (error) {
        console.error("Error saving status:", error);
      }
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(URL.createObjectURL(selectedImage)); // Show preview instantly
      uploadImage(selectedImage); // Auto-upload
    }
  };
  
  const uploadImage = async (file) => {
    if (!file || !currentUser) return;
  
    setUploading(true);
    const storageRef = ref(getStorage(), `profileImages/${currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        
        // Save URL to Firestore
        await setDoc(doc(db, "users", currentUser.uid), { profilePic: downloadURL }, { merge: true });
  
        // Save locally
        localStorage.setItem("userData", JSON.stringify({ ...JSON.parse(localStorage.getItem("userData")), profilePic: downloadURL }));
  
        setImage(downloadURL); // Update UI
        setUploading(false);
      }
    );
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
        <div className="relative w-36 h-36 rounded-full bg-gray-500 flex items-center justify-center mb-12 mt-24 overflow-hidden">
          {image ? (
            <img src={image} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-6xl font-light">
              {name ? name.charAt(0).toUpperCase() : "A"}
            </span>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Camera Icon */}
          <label 
            htmlFor="fileInput" 
            className="absolute bottom-2 right-2 bg-black/70 p-3 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Camera className="text-white" size={24} />
          </label>
          
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* Name Input - Always editable with feedback */}
        <div className="w-full mb-6 relative">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Your Name</p>
          <div className={`flex justify-between items-center p-3 border ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100"
          } ${nameSuccess ? "border-green-500" : ""} transition-all duration-300`}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full focus:outline-none ${
                theme === "dark" ? "text-white bg-gray-800" : "text-gray-800 bg-gray-100"
              } border-b border-gray-400`}
            />
            <button 
              onClick={handleSaveName}
              className={`p-2 rounded-full transition-colors ${nameSuccess ? "bg-green-100" : "hover:bg-gray-200"}`}
            >
              <Check 
                size={20} 
                style={{ color: nameSuccess ? "#10B981" : primaryColor }} 
                className={`transition-transform ${nameSuccess ? "scale-110" : ""}`}
              />
            </button>
          </div>
          {nameSuccess && (
            <div className="absolute right-0 -bottom-6 text-green-500 text-sm font-medium">
              Name saved successfully!
            </div>
          )}
        </div>

        {/* Status Input - Always editable with feedback */}
        <div className="w-full mb-12 relative">
          <p className="text-sm mb-2" style={{ color: primaryColor }}>Status</p>
          <div className={`flex justify-between items-center p-3 border ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100"
          } ${statusSuccess ? "border-green-500" : ""} transition-all duration-300`}>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full focus:outline-none ${
                theme === "dark" ? "text-white bg-gray-800" : "text-gray-800 bg-gray-100"
              } border-b border-gray-400`}
            />
            <button 
              onClick={handleSaveStatus}
              className={`p-2 rounded-full transition-colors ${statusSuccess ? "bg-green-100" : "hover:bg-gray-200"}`}
            >
              <Check 
                size={20} 
                style={{ color: statusSuccess ? "#10B981" : primaryColor }} 
                className={`transition-transform ${statusSuccess ? "scale-110" : ""}`}
              />
            </button>
          </div>
          {statusSuccess && (
            <div className="absolute right-0 -bottom-6 text-green-500 text-sm font-medium">
              Status saved successfully!
            </div>
          )}
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