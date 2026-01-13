import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import ProfileIcon from "../components/ProfileIcon";
import { getCurrentUserID, getUserID } from "../utils/userHelper";
import "./EnhancedProfile.css";

export default function EnhancedProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [exploreUsers, setExploreUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Get profile user ID - from URL param or current logged-in user
  const profileUserId = useMemo(() => {
    if (userId) {
      return userId;
    }
    const currentId = getCurrentUserID();
    if (!currentId) {
      console.warn("No userId in URL and no current user logged in");
    }
    return currentId;
  }, [userId]);

  useEffect(() => {
    if (!profileUserId) {
      console.log("No profileUserId available. userId:", userId, "currentUser:", getCurrentUserID());
      setLoading(false);
      return;
    }

    console.log("Loading profile for userId:", profileUserId);
    fetchUserProfile();

    // Load tab-specific data
    if (activeTab === "followers") fetchFollowers();
    if (activeTab === "following") fetchFollowing();
    if (activeTab === "explore") fetchExploreUsers();
    if (activeTab === "chats") fetchConversations();
    if (activeTab === "recipes") fetchRecipes();
    if (activeTab === "blogs") fetchBlogs();
    if (activeTab === "profile") {
      fetchRecipes();
      fetchBlogs();
    }
  }, [profileUserId, activeTab]);

  // Fetch profile data
  const fetchUserProfile = async () => {
    if (!profileUserId) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${profileUserId}`);
      setUser(res.data);

      const currentUserIdStr = getCurrentUserID();
      const profileIdStr = getUserID(res.data);

      const isOwn =
        currentUserIdStr && profileIdStr && currentUserIdStr === profileIdStr;
      setIsOwnProfile(isOwn);

      if (!isOwn && res.data.followers) {
        const followerIds = res.data.followers.map((f) =>
          typeof f === "object" ? f._id.toString() : f.toString()
        );
        setIsFollowing(followerIds.includes(currentUserIdStr));
      }
      setLoading(false);
    } catch (err) {
      console.error(
        "Error fetching profile:",
        err.response?.data || err.message
      );
      setUser(null);
      setLoading(false);
    }
  };

  // Fetch followers
  const fetchFollowers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user/${profileUserId}/followers`
      );
      setFollowers(res.data.followers || []);
    } catch (err) {
      console.error(
        "Error fetching followers:",
        err.response?.data || err.message
      );
    }
  };

  // Fetch following
  const fetchFollowing = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/user/${profileUserId}/following`
      );
      setFollowing(res.data.following || []);
    } catch (err) {
      console.error(
        "Error fetching following:",
        err.response?.data || err.message
      );
    }
  };

  // Fetch explore users
  const fetchExploreUsers = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExploreUsers(res.data.users || []);
    } catch (err) {
      console.error(
        "Error fetching explore users:",
        err.response?.data || err.message
      );
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/message/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error(
        "Error fetching conversations:",
        err.response?.data || err.message
      );
    }
  };

  // Fetch recipes
  const fetchRecipes = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/profile/${profileUserId}/recipes`
      );
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error(
        "Error fetching recipes:",
        err.response?.data || err.message
      );
      setRecipes([]);
    }
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/profile/${profileUserId}/blogs`
      );
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err.response?.data || err.message);
      setBlogs([]);
    }
  };

  // Follow/unfollow user
  const handleFollow = async () => {
    if (!token) {
      alert("Please login to follow users");
      return;
    }
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      await axios.post(
        `${API_BASE_URL}/user/${profileUserId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(!isFollowing);
      fetchUserProfile();
    } catch (err) {
      console.error(
        "Error following/unfollowing:",
        err.response?.data || err.message
      );
    }
  };

  // Update username
  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/profile/username`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, username: res.data.user.username });
      const updatedUser = { ...currentUser, username: res.data.user.username };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditingUsername(false);
      setNewUsername("");
      alert("Username updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update username");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  if (!profileUserId) {
    return (
      <div className="profile-error" style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Profile Not Available</h2>
        <p>Please log in to view your profile or navigate to a user's profile.</p>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => navigate("/")} style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>
            Go to Home
          </button>
          {!token && (
            <button onClick={() => navigate("/")} style={{ padding: "0.5rem 1rem" }}>
              Login
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-error" style={{ padding: "2rem", textAlign: "center" }}>
        <h2>User not found</h2>
        <p>The user profile could not be loaded.</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          User ID: {profileUserId}
        </p>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => navigate("/")} style={{ marginRight: "1rem", padding: "0.5rem 1rem" }}>
            Go to Home
          </button>
          <button onClick={() => navigate("/profile")} style={{ padding: "0.5rem 1rem" }}>
            My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-profile-wrapper">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="sidebar-tabs">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button
              className={activeTab === "followers" ? "active" : ""}
              onClick={() => setActiveTab("followers")}
            >
              Followers ({user.followersCount || 0})
            </button>
            <button
              className={activeTab === "following" ? "active" : ""}
              onClick={() => setActiveTab("following")}
            >
              Following ({user.followingCount || 0})
            </button>
            <button
              className={activeTab === "explore" ? "active" : ""}
              onClick={() => setActiveTab("explore")}
            >
              Explore
            </button>
            <button
              className={activeTab === "chats" ? "active" : ""}
              onClick={() => setActiveTab("chats")}
            >
              Chats
            </button>
          </div>
        </div>

        <div className="profile-main-content">
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              onFollow={handleFollow}
              onEditUsername={() => {
                setEditingUsername(true);
                setNewUsername(user.username);
              }}
              editingUsername={editingUsername}
              newUsername={newUsername}
              setNewUsername={setNewUsername}
              onUpdateUsername={handleUpdateUsername}
              onCancelEdit={() => {
                setEditingUsername(false);
                setNewUsername("");
              }}
              onLogout={handleLogout}
              onTabChange={setActiveTab}
              recipes={recipes}
              blogs={blogs}
              navigate={navigate}
            />
          )}

          {activeTab === "followers" && (
            <UserListTab
              users={followers}
              title="Followers"
              onUserClick={(userId) => navigate(`/profile/${userId}`)}
            />
          )}

          {activeTab === "following" && (
            <UserListTab
              users={following}
              title="Following"
              onUserClick={(userId) => navigate(`/profile/${userId}`)}
            />
          )}

          {activeTab === "explore" && (
            <UserListTab
              users={exploreUsers}
              title="Explore Users"
              onUserClick={(userId) => navigate(`/profile/${userId}`)}
              showFollowButton={true}
            />
          )}

          {activeTab === "chats" && (
            <ChatsTab
              conversations={conversations}
              onChatClick={(userId) => navigate(`/chat/${userId}`)}
              onUserClick={(userId) => navigate(`/profile/${userId}`)}
            />
          )}

          {activeTab === "recipes" && (
            <ContentTab
              items={recipes}
              type="recipes"
              onItemClick={(id) => navigate(`/FoodDetails/${id}`)}
            />
          )}

          {activeTab === "blogs" && (
            <ContentTab
              items={blogs}
              type="blogs"
              onItemClick={(id) => navigate(`/blogs/${id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Component Definitions ---

// ProfileTab Component
function ProfileTab({
  user,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEditUsername,
  editingUsername,
  newUsername,
  setNewUsername,
  onUpdateUsername,
  onCancelEdit,
  onLogout,
  onTabChange,
  recipes,
  blogs,
  navigate,
}) {
  const token = localStorage.getItem("token");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await axios.post(
        `${API_BASE_URL}/profile/${user._id}/upload-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      window.location.reload();
    } catch (err) {
      alert("Failed to upload image");
      setUploadingImage(false);
    }
  };

  return (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="profile-image-container" style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 10px", display: "flex", justifyContent: "center", alignItems: "center", background: user.profileImage ? "transparent" : "#ff00c8ff" }}>
            {user.profileImage ? (
              <img
                src={`${API_BASE_URL}/profilepics/${user.profileImage}`}
                alt={user.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", fontWeight: "700", fontSize: "3rem" }}>
                {user.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          {isOwnProfile && (
            <label className="upload-image-label" style={{ cursor: "pointer", padding: "8px 16px", background: "#007bff", color: "white", borderRadius: "8px", display: "inline-block" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={uploadingImage}
              />
              {uploadingImage ? "Uploading..." : "Change Photo"}
            </label>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name-section">
            {editingUsername ? (
              <div className="username-edit" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="username-input"
                  style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
                />
                <button onClick={onUpdateUsername} className="save-btn" style={{ padding: "8px 16px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Save
                </button>
                <button onClick={onCancelEdit} className="cancel-btn" style={{ padding: "8px 16px", background: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="username-display" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <h1 style={{ margin: 0 }}>{user.username}</h1>
                {isOwnProfile && (
                  <button onClick={onEditUsername} className="edit-btn" style={{ padding: "6px 12px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Edit Username
                  </button>
                )}
              </div>
            )}
          </div>
          {user.bio && <p className="profile-bio" style={{ margin: "10px 0", color: "#666" }}>{user.bio}</p>}
          <div className="profile-stats" style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
            <div className="stat-item" style={{ textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: "1.5rem" }}>{user.followersCount || 0}</strong>
              <span style={{ color: "#666" }}>Followers</span>
            </div>
            <div className="stat-item" style={{ textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: "1.5rem" }}>{user.followingCount || 0}</strong>
              <span style={{ color: "#666" }}>Following</span>
            </div>
            <div className="stat-item" style={{ textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: "1.5rem" }}>{user.recipesCount || 0}</strong>
              <span style={{ color: "#666" }}>Recipes</span>
            </div>
            <div className="stat-item" style={{ textAlign: "center" }}>
              <strong style={{ display: "block", fontSize: "1.5rem" }}>{user.blogsCount || 0}</strong>
              <span style={{ color: "#666" }}>Blogs</span>
            </div>
          </div>
          {!isOwnProfile && (
            <button onClick={onFollow} className="follow-button" style={{ padding: "10px 20px", background: isFollowing ? "#dc3545" : "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          )}
          {isOwnProfile && (
            <button onClick={onLogout} className="logout-button" style={{ padding: "10px 20px", background: "#dc3545", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "1rem" }}>
              Logout
            </button>
          )}
        </div>
      </div>

      <div className="profile-content-tabs" style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
        <button onClick={() => onTabChange("recipes")} className="content-tab-btn" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Recipes ({recipes.length})
        </button>
        <button onClick={() => onTabChange("blogs")} className="content-tab-btn" style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Blogs ({blogs.length})
        </button>
      </div>

      <div className="profile-content-grid">
        {recipes.length > 0 && (
          <div className="content-section">
            <h3>Recipes</h3>
            <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="content-card"
                  onClick={() => navigate(`/FoodDetails/${recipe._id}`)}
                  style={{ cursor: "pointer", background: "#f8f9fa", borderRadius: "8px", overflow: "hidden" }}
                >
                  {recipe.coverImage && (
                    <img
                      src={recipe.coverImage?.startsWith("http") ? recipe.coverImage : `${API_BASE_URL}/images/${recipe.coverImage}`}
                      alt={recipe.title}
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                  )}
                  <h4 style={{ padding: "10px", margin: 0 }}>{recipe.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {blogs.length > 0 && (
          <div className="content-section">
            <h3>Blogs</h3>
            <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="content-card"
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  style={{ cursor: "pointer", background: "#f8f9fa", borderRadius: "8px", overflow: "hidden" }}
                >
                  {blog.image && (
                    <img
                      src={`${API_BASE_URL}/images/${blog.image}`}
                      alt={blog.title}
                      style={{ width: "100%", height: "150px", objectFit: "cover" }}
                    />
                  )}
                  <h4 style={{ padding: "10px", margin: 0 }}>{blog.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {recipes.length === 0 && blogs.length === 0 && (
          <p className="no-content" style={{ textAlign: "center", padding: "40px", color: "#666" }}>No recipes or blogs yet.</p>
        )}
      </div>
    </div>
  );
}

// UserListTab Component
function UserListTab({ users, title, onUserClick, showFollowButton = false }) {
  return (
    <div className="user-list-tab">
      <h2 style={{ marginBottom: "20px" }}>{title}</h2>
      {users.length === 0 ? (
        <p className="no-users" style={{ textAlign: "center", padding: "40px", color: "#666" }}>No {title.toLowerCase()} yet.</p>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-list-item"
              onClick={() => onUserClick(user._id)}
              style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" }}
            >
              <ProfileIcon user={{ profilePic: user.profileImage, username: user.username }} />
              <div className="user-list-info" style={{ flex: 1 }}>
                <h3 style={{ margin: 0 }}>{user.username}</h3>
                {user.email && <p style={{ margin: "5px 0 0 0", color: "#666" }}>{user.email}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ChatsTab Component
function ChatsTab({ conversations, onChatClick, onUserClick }) {
  return (
    <div className="chats-tab">
      <h2 style={{ marginBottom: "20px" }}>Conversations</h2>
      {conversations.length === 0 ? (
        <p className="no-chats" style={{ textAlign: "center", padding: "40px", color: "#666" }}>No conversations yet.</p>
      ) : (
        <div className="conversations-list">
          {conversations.map((conv) => (
            <div key={conv.user._id} className="conversation-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px", background: "#f8f9fa", borderRadius: "8px", marginBottom: "10px" }}>
              <div
                className="conversation-user"
                onClick={() => onUserClick(conv.user._id)}
                style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, cursor: "pointer" }}
              >
                <ProfileIcon user={{ profilePic: conv.user.profileImage, username: conv.user.username }} />
                <div className="conversation-info" style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>{conv.user.username}</h3>
                  {conv.lastMessage && (
                    <p className="last-message" style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>{conv.lastMessage.content}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onChatClick(conv.user._id)}
                className="chat-button"
                style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ContentTab Component
function ContentTab({ items, type, onItemClick }) {
  return (
    <div className="content-tab">
      <h2 style={{ marginBottom: "20px" }}>{type === "recipes" ? "Recipes" : "Blogs"}</h2>
      {items.length === 0 ? (
        <p className="no-content" style={{ textAlign: "center", padding: "40px", color: "#666" }}>No {type} yet.</p>
      ) : (
        <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {items.map((item) => (
            <div
              key={item._id}
              className="content-card"
              onClick={() => onItemClick(item._id)}
              style={{ cursor: "pointer", background: "#f8f9fa", borderRadius: "8px", overflow: "hidden" }}
            >
              {(item.coverImage || item.image) && (
                <img
                  src={
                    (item.coverImage || item.image)?.startsWith("http")
                      ? item.coverImage || item.image
                      : `${API_BASE_URL}/images/${item.coverImage || item.image}`
                  }
                  alt={item.title}
                  style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
              )}
              <h4 style={{ padding: "10px", margin: 0 }}>{item.title}</h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
