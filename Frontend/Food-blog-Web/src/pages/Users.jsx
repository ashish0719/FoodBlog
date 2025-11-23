import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import ProfileIcon from "../components/ProfileIcon";
import { useNavigate } from "react-router-dom";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Users response:", res.data);
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      console.error("Error details:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Please log in to view users");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    if (!token) {
      alert("Please login to follow users");
      return;
    }

    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `${API_BASE_URL}/user/${userId}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error("Error following/unfollowing:", err);
      alert("Failed to follow/unfollow user");
    }
  };

  const handleChat = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return <div className="users-loading">Loading users...</div>;
  }

  return (
    <div className="users-container">
      <h1 className="users-title">Discover Users</h1>
      <div className="users-grid">
        {users.map((user) => (
          <div 
            key={user._id} 
            className="user-card" 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => navigate(`/user/${user._id}`)}
          >
            <div className="user-header">
              <ProfileIcon user={{ profilePic: user.profileImage }} />
              <div className="user-info">
                <h3>{user.username}</h3>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
            {user.bio && <p className="user-bio">{user.bio}</p>}
            <div className="user-stats">
              <span>{user.followersCount || 0} Followers</span>
              <span>{user.followingCount || 0} Following</span>
            </div>
            <div className="user-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className={`follow-btn ${user.isFollowing ? "following" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFollow(user._id, user.isFollowing);
                }}
                style={{ zIndex: 2, position: 'relative' }}
              >
                {user.isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button
                className="chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChat(user._id);
                }}
                style={{ zIndex: 2, position: 'relative' }}
              >
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

