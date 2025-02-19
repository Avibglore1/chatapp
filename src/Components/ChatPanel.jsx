import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Sun, CircleFadingPlus, MessageSquare, UserRound, Search } from "lucide-react";
import pic from "./../../public/gogglepic.png";

function ChatPanel({ onProfileClick, onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(user => user.id !== currentUserId);

        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    if (currentUserId) {
      getUsers();
    }
  }, [currentUserId]);

  const handleUserSelect = (user) => {
    if (!currentUserId) return;
    if (user.id === currentUserId) return;

    const chatId = currentUserId < user.id
      ? `${currentUserId}_${user.id}`
      : `${user.id}_${currentUserId}`;

    setSelectedUserId(user.id);
    onSelectUser(user);
  };

  return (
    <div className="w-[35%] h-screen border-r bg-white relative">
      {/* Header inside ChatPanel */}
      <header className="bg-gray-200 flex justify-between items-center shadow-sm p-3">
        <button onClick={onProfileClick}>
          <img src={pic} className="w-10 h-10 rounded-full object-cover" alt="Profile" />
        </button>
        <div className="flex gap-3">
          <Sun />
          <CircleFadingPlus />
          <MessageSquare />
          <UserRound />
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white p-3">
        <div className="flex bg-gray-200 gap-3 mb-3 p-2 shadow-sm rounded-sm">
          <Search />
          <p>Search</p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-4">Loading users...</p>
        ) : (
          <ul>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No users found</p>
            ) : (
              users.map((user, index) => (
                <React.Fragment key={user.id}>
                  <li
                    className={`flex gap-3 p-2 cursor-pointer transition 
                    ${selectedUserId === user.id ? "bg-gray-200" : "hover:bg-gray-100"}`}
                    onClick={() => handleUserSelect(user)}
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
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ChatPanel;
