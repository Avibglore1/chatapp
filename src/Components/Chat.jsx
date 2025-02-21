import React, { useState, useEffect, useRef } from "react";
import { doc, updateDoc, arrayUnion, serverTimestamp, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { useTheme } from './ThemeContext';

function Chat({ user, currentUserId }) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  

  const getChatId = () => [currentUserId, user.id].sort().join("_");

  const formatTime = (timestamp) => {
    if (!timestamp) return "Sending...";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user?.id || !currentUserId) {
      setIsLoading(true); // Keep loading until a user is selected
      return;
    }

    const chatId = getChatId();
    const chatDocRef = doc(db, "chats", chatId);

    const initializeChat = async () => {
      try {
        const docSnap = await getDoc(chatDocRef);
        if (!docSnap.exists()) {
          await setDoc(chatDocRef, {
            participants: [currentUserId, user.id],
            messages: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (err) {
        setError("Failed to initialize chat");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();

    const unsubscribe = onSnapshot(
      chatDocRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const sortedMessages = [...(data.messages || [])].sort(
            (a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0)
          );
          setMessages(sortedMessages);

          if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            if (isNearBottom || sortedMessages[sortedMessages.length - 1]?.senderId === currentUserId) {
              setTimeout(scrollToBottom, 100);
            }
          }
        }
      },
      (err) => setError("Failed to load messages")
    );

    return () => unsubscribe();
  }, [user?.id, currentUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const chatId = getChatId();
      const chatDocRef = doc(db, "chats", chatId);
      const newMsg = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: currentUserId,
        senderName: auth.currentUser?.displayName || "Unknown",
        text: newMessage.trim(),
        timestamp: new Date(),
      };

      await updateDoc(chatDocRef, {
        messages: arrayUnion(newMsg),
        updatedAt: serverTimestamp(),
      });

      setNewMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      setError("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${
        theme === "dark" ? "bg-gray-800 text-red-400" : "bg-gray-50 text-red-500"
      }`}>
        {error}
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-full ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-50 text-black"
      }`}>
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 bg-gray-50 relative"> 
      <header className="bg-gray-200 flex items-center shadow-sm p-3 w-full absolute top-0 left-0 z-0">
        <img
          src={user.profile_pic || "/default-avatar.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover mr-2"
        />
        <h1 className="text-lg font-semibold">{user.name}</h1>
      </header>

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 mt-[56px]">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* Removed sender name display completely */}
                <p className="break-words">{msg.text}</p>
                <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="sticky bottom-0 border-t p-4 bg-white shadow-md">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;