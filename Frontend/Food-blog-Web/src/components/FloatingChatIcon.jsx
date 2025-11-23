import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "./FloatingChatIcon.css";

export default function FloatingChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isOpen && token) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, token]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/message/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    }
  };

  if (!token) return null;

  return (
    <div className="floating-chat-container">
      {isOpen && (
        <div className="chat-dropdown">
          <div className="chat-dropdown-header">
            <h3>Messages</h3>
            <button onClick={() => setIsOpen(false)} className="close-chat-btn">
              ×
            </button>
          </div>
          <div className="chat-conversations">
            {conversations.length === 0 ? (
              <p className="no-conversations">No messages yet</p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.user._id}
                  className="chat-conversation-item"
                  onClick={() => {
                    navigate(`/chat/${conv.user._id}`);
                    setIsOpen(false);
                  }}
                >
                  <div className="chat-user-info">
                    <div className="chat-user-avatar">
                      {conv.user.profileImage ? (
                        <img
                          src={`${API_BASE_URL}/profilepics/${conv.user.profileImage}`}
                          alt={conv.user.username}
                        />
                      ) : (
                        <div className="chat-avatar-placeholder">
                          {conv.user.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="chat-user-details">
                      <h4>{conv.user.username}</h4>
                      <p className="chat-last-message">
                        {conv.lastMessage?.content?.slice(0, 30) || "No messages"}
                      </p>
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="chat-unread-badge">{conv.unreadCount}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <button
        className="floating-chat-icon"
        onClick={() => setIsOpen(!isOpen)}
        title="Open Messages"
      >
        💬
        {conversations.some((c) => c.unreadCount > 0) && (
          <span className="chat-notification-dot"></span>
        )}
      </button>
    </div>
  );
}


