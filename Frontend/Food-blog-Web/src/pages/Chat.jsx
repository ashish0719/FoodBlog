import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import ProfileIcon from "../components/ProfileIcon";
import "./Chat.css";

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [userId, token, navigate]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/message/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(res.data.messages);
      if (res.data.messages.length > 0) {
        const firstMessage = res.data.messages[0];
        const user =
          firstMessage.sender._id === userId
            ? firstMessage.sender
            : firstMessage.receiver;
        setOtherUser(user);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/message/send`,
        {
          receiverId: userId,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Back
        </button>
        {otherUser && (
          <div className="chat-user-info">
            <ProfileIcon user={{ profilePic: otherUser.profileImage }} />
            <span 
              onClick={() => navigate(`/user/${otherUser._id}`)}
              style={{ cursor: 'pointer' }}
            >
              {otherUser.username}
            </span>
          </div>
        )}
        {otherUser && (
          <button 
            className="view-profile-chat-btn"
            onClick={() => navigate(`/profile/${otherUser._id}`)}
          >
            View Profile
          </button>
        )}
      </div>
      <div className="messages-container">
        {messages.map((message) => {
          const senderId = typeof message.sender._id === 'object' ? message.sender._id.toString() : message.sender._id;
          const currentUserId = typeof currentUser.id === 'object' ? currentUser.id.toString() : currentUser.id;
          const isOwn = senderId === currentUserId;
          return (
            <div
              key={message._id}
              className={`message ${isOwn ? "own-message" : "other-message"}`}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">
          Send
        </button>
      </form>
    </div>
  );
}

