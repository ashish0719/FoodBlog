import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import ProfileIcon from "../components/ProfileIcon";
import "./BlogDetail.css";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/blog/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error("Error fetching blog:", err);
      alert("Blog not found");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="blog-detail-loading">Loading blog...</div>;
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="blog-detail-container">
      <button className="back-btn" onClick={() => navigate("/blogs")}>
        ← Back to Blogs
      </button>
      <article className="blog-detail">
        {blog.image && (
          <div className="blog-detail-image">
            <img src={`${API_BASE_URL}/images/${blog.image}`} alt={blog.title} />
          </div>
        )}
        <div className="blog-detail-content">
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <div className="blog-author-info">
              <ProfileIcon user={{ profilePic: blog.author?.profileImage }} />
              <div>
                <span className="blog-author-name">
                  @{blog.author?.username || "Unknown"}
                </span>
                <span className="blog-date">
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="blog-detail-tags">
              {blog.tags.map((tag, idx) => (
                <span key={idx} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="blog-detail-text">
            {blog.content.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}


