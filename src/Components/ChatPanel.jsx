import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Sun, Moon, CircleFadingPlus, MessageSquare, UserRound, Search, X } from "lucide-react";
import defaultPic from "./../../public/gogglepic.png";
import { useTheme } from "./ThemeContext";

function ChatPanel({ onProfileClick, onSelectUser, currentUserId }) {
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profilePic, setProfilePic] = useState(defaultPic);

  // Initial fetch of users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) return;
      
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        
        const usersData = usersSnapshot.docs
          .map((doc) => {
            const userData = doc.data();
            return {
              id: doc.id,
              name: userData.name,
              profilePic: userData.profilePic || userData.profile_pic || defaultPic, // Handle both profilePic and profile_pic
              ...userData
            };
          })
          .filter((user) => user.id !== currentUserId);

        setUsers(usersData);
        setFilteredUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  // Listen for current user's profile updates
  useEffect(() => {
    if (!currentUserId) return;

    const userDocRef = doc(db, "users", currentUserId);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setProfilePic(userData.profilePic || userData.profile_pic || defaultPic);
      }
    });

    return () => unsubscribe();
  }, [currentUserId]);

  // Listen for other users' profile updates
  useEffect(() => {
    if (!currentUserId || users.length === 0) return;

    const unsubscribes = users.map(user => {
      const userRef = doc(db, "users", user.id);
      return onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const updatedUserData = docSnapshot.data();
          setUsers(prevUsers => 
            prevUsers.map(prevUser => 
              prevUser.id === user.id 
                ? {
                    ...prevUser,
                    profilePic:  updatedUserData.profile_pic || defaultPic,
                    name: updatedUserData.name
                  }
                : prevUser
            )
          );
        }
      });
    });

    return () => unsubscribes.forEach(unsubscribe => unsubscribe());
  }, [currentUserId]); // Remove users from dependency array to prevent infinite loop

  // Filter Users Based on Search Query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleUserSelect = (user) => {
    if (!currentUserId || user.id === currentUserId) return;
    setSelectedUserId(user.id);
    onSelectUser(user);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      className={`w-[30%] h-screen border-r ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      } relative`}
    >
      {/* Header */}
      <header
        className={`flex justify-between items-center shadow-sm p-3 ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <button onClick={onProfileClick}>
          <img
            src={profilePic}
            className="w-10 h-10 rounded-full object-cover"
            alt="Profile"
            onError={(e) => {
              e.target.src = defaultPic;
            }}
          />
        </button>
        <div className="flex gap-3">
          <button onClick={toggleTheme}>
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <CircleFadingPlus />
          <MessageSquare />
          <UserRound />
        </div>
      </header>

      {/* Search Bar */}
      <div className={`p-3 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
        <div
          className={`flex items-center ${
            theme === "dark" ? "bg-gray-700" : "bg-gray-200"
          } mb-3 p-2 shadow-sm rounded-sm`}
        >
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users"
            className={`bg-transparent flex-1 outline-none text-sm ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          />
          {searchQuery && (
            <button onClick={handleClearSearch} className="text-gray-500">
              <X size={16} />
            </button>
          )}
        </div>

        {/* User List */}
        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading users...</p>
        ) : (
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {searchQuery ? `No users matching "${searchQuery}"` : "No users found"}
              </p>
            ) : (
              <ul>
                {filteredUsers.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <li
                      className={`flex gap-3 p-2 cursor-pointer transition 
                        ${
                          selectedUserId === user.id
                            ? theme === "dark"
                              ? "bg-gray-700"
                              : "bg-gray-200"
                            : theme === "dark"
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                        }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.profilePic}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={`${user.name}'s profile`}
                        onError={(e) => {
                          e.target.src = defaultPic;
                        }}
                      />
                      <p className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                        {user.name}
                      </p>
                    </li>
                    {index !== filteredUsers.length - 1 && (
                      <hr className="border-gray-300" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPanel;