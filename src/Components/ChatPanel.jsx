import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Sun, CircleFadingPlus, MessageSquare, UserRound, Search } from "lucide-react";
import pic from "./../../public/gogglepic.png";
import Profile from "./Profile"; // Import Profile component

function ChatPanel({ onProfileClick, onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null); // Track selected user

  const getUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[20%]">
      <header>
        <div className="bg-gray-200 flex justify-between items-center shadow-sm p-2">
          <button onClick={onProfileClick}>
            <img src={pic} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
          </button>
          <div className="flex gap-3">
            <Sun />
            <CircleFadingPlus />
            <MessageSquare />
            <UserRound />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-3">
        <div className="flex bg-gray-200 gap-3 mb-3 p-2 shadow-sm rounded-sm">
          <Search />
          <p>Search</p>
        </div>

        {/* Users List */}
        <ul>
          {users.map((user, index) => (
            <React.Fragment key={user.id}>
              <li
                className={`flex gap-3 p-2 transition cursor-pointer 
                  ${selectedUserId === user.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setSelectedUserId(user.id); // Update selected user
                  onSelectUser(user); // Notify Home component
                }}
              >
                <img
                  src={user.profile_pic}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="User"
                />
                <p>{user.name}</p>
              </li>
              {index !== users.length - 1 && <hr className="border-gray-300" />}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatPanel;

