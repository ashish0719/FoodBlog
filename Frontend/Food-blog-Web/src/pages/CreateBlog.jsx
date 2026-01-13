import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import "./CreateBlog.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);
  const [imageInputType, setImageInputType] = useState("file"); // 'file' or 'url'
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login to create a blog");
      navigate("/");
      return;
    }

    if (!title || !content) {
      alert("Please fill in title and content");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    // formData.append("tags", tags); // Removed duplicate
    if (imageInputType === "file" && image) {
      formData.append("image", image);
    } else if (imageInputType === "url" && imageUrl) {
      formData.append("image", imageUrl);
    }

    try {
      await axios.post(`${API_BASE_URL}/blog/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/blogs");
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <h1 className="create-blog-title">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows="15"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., food, recipe, cooking"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Cover Image Source</label>
          <select
            value={imageInputType}
            onChange={(e) => setImageInputType(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          >
            <option value="file">Upload File</option>
            <option value="url">Image URL</option>
          </select>

          {imageInputType === "file" ? (
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          ) : (
            <input
              type="text"
              placeholder="Paste Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{ padding: "8px", width: "100%" }}
            />
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}


