import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import ProfileIcon from "../components/ProfileIcon";
// ⬅️ Import your global CSS

export default function BlogingCard() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blog`);
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-header">
        <h1 className="blog-heading">Foodie Blogs</h1>
        {token && (
          <button
            className="create-blog-btn"
            onClick={() => navigate("/blogs/create")}
          >
            + Create Blog
          </button>
        )}
      </div>

      {loading ? (
        <p className="blog-loading">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="blog-loading">No blogs found.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-card"
              onClick={() => navigate(`/blogs/${blog._id}`)}
            >
              {blog.image && (
                <img
                  src={`${API_BASE_URL}/images/${blog.image}`}
                  alt={blog.title}
                  className="blog-image"
                />
              )}
              <div className="blog-content">
                <h2>{blog.title}</h2>
                <p className="blog-text quoted">
                  {blog.content.slice(0, 150)}
                  {blog.content.length > 150 ? "..." : ""}
                </p>

                <div className="blog-author">
                  <ProfileIcon user={{ profilePic: blog.author?.profileImage }} />
                  <div>
                    <p>
                      By <span>@{blog.author?.username || "unknown"}</span>
                    </p>
                    <p className="blog-date">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="blog-tags">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
