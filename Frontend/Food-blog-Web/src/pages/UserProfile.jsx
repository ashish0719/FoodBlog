import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "./UserProfile.css";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recipes"); // "recipes" or "blogs"

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    fetchUserProfile();
    fetchRecipes();
    fetchBlogs();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${id}`);
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setLoading(false);
    }
  };

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${id}/recipes`);
      setRecipes(res.data.recipes || []);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/${id}/blogs`);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-content">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>

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
          </div>

          <div className="profile-info-section">
            <h1 className="username-text">{user.username}</h1>
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
          </div>
        </div>

        {/* Content Tabs */}
        <div className="content-tabs">
          <button
            className={`tab-button ${activeTab === "recipes" ? "active" : ""}`}
            onClick={() => setActiveTab("recipes")}
          >
            Recipes ({recipes.length})
          </button>
          <button
            className={`tab-button ${activeTab === "blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("blogs")}
          >
            Blogs ({blogs.length})
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
                          src={recipe.coverImage?.startsWith("http") ? recipe.coverImage : `${API_BASE_URL}/images/${recipe.coverImage}`}
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
                          src={blog.image?.startsWith("http") ? blog.image : `${API_BASE_URL}/images/${blog.image}`}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

