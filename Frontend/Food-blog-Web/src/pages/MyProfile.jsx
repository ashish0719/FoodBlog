import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { getCurrentUserID } from "../utils/userHelper";
import "./MyProfile.css";

export default function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState("recipes"); // "recipes" or "blogs"

  const token = localStorage.getItem("token");
  const currentUserId = getCurrentUserID();

  useEffect(() => {
    if (!token || !currentUserId) {
      navigate("/");
      return;
    }
    fetchProfile();
    fetchRecipes();
    fetchBlogs();
  }, [currentUserId, token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${currentUserId}`);
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${currentUserId}/recipes`);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${currentUserId}/blogs`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await axios.post(
        `${API_BASE_URL}/profile/${currentUserId}/upload-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchProfile(); // Refresh profile
      setUploadingImage(false);
    } catch (err) {
      alert("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/profile/username`,
        { username: newUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser({ ...user, username: res.data.user.username });
      const updatedUser = JSON.parse(localStorage.getItem("user") || "{}");
      updatedUser.username = res.data.user.username;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditingUsername(false);
      setNewUsername("");
      alert("Username updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update username");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="my-profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="my-profile-container">
        <div className="error">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="my-profile-container">
      <div className="my-profile-content">
        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="avatar-section">
            <div className="avatar-circle">
              {user.profileImage ? (
                <img
                  src={`${API_BASE_URL}/profilepics/${user.profileImage}`}
                  alt={user.username}
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-initial">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            {/* Change Photo Button - BELOW the circle */}
            <label className="change-photo-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                disabled={uploadingImage}
              />
              <button
                className="change-photo-btn"
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Change Photo"}
              </button>
            </label>
          </div>

          <div className="profile-info-section">
            <div className="username-section">
              {editingUsername ? (
                <div className="username-edit-container">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="username-input"
                    placeholder="Enter new username"
                  />
                  <button
                    onClick={handleUpdateUsername}
                    className="save-username-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingUsername(false);
                      setNewUsername("");
                    }}
                    className="cancel-username-btn"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="username-display-container">
                  <h1 className="username-text">{user.username}</h1>
                  <button
                    onClick={() => {
                      setEditingUsername(true);
                      setNewUsername(user.username);
                    }}
                    className="edit-username-btn"
                  >
                    Edit Username
                  </button>
                </div>
              )}
            </div>

            {user.bio && <p className="profile-bio">{user.bio}</p>}

            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{user.followersCount || 0}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.followingCount || 0}</div>
                <div className="stat-label">Following</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.recipesCount || 0}</div>
                <div className="stat-label">Recipes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{user.blogsCount || 0}</div>
                <div className="stat-label">Blogs</div>
              </div>
            </div>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="content-tabs">
          <button
            className={`tab-button ${activeTab === "recipes" ? "active" : ""}`}
            onClick={() => setActiveTab("recipes")}
          >
            My Recipes ({recipes.length})
          </button>
          <button
            className={`tab-button ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            My Blogs ({blogs.length})
          </button>
        </div>

        {/* Content Grid */}
        <div className="content-grid-section">
          {activeTab === "recipes" && (
            <>
              {recipes.length > 0 ? (
                <div className="content-grid">
                  {recipes.map((recipe) => (
                    <div
                      key={recipe._id}
                      className="content-card"
                      onClick={() => navigate(`/FoodDetails/${recipe._id}`)}
                    >
                      {recipe.coverImage && (
                        <img
                          src={`${API_BASE_URL}/images/${recipe.coverImage}`}
                          alt={recipe.title}
                          className="content-image"
                        />
                      )}
                      <div className="content-title">{recipe.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No recipes yet.</p>
                  <button
                    onClick={() => navigate("/addRecipe")}
                    className="create-btn"
                  >
                    Create Recipe
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "blogs" && (
            <>
              {blogs.length > 0 ? (
                <div className="content-grid">
                  {blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="content-card"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      {blog.image && (
                        <img
                          src={`${API_BASE_URL}/images/${blog.image}`}
                          alt={blog.title}
                          className="content-image"
                        />
                      )}
                      <div className="content-title">{blog.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No blogs yet.</p>
                  <button
                    onClick={() => navigate("/blogs/create")}
                    className="create-btn"
                  >
                    Create Blog
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

