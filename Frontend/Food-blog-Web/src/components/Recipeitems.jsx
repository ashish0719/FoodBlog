import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import API_BASE_URL from "../config/api";

// RecipeLike Component
const RecipeLike = ({
  recipeId,
  initialLikes,
  likedByUser,
  token,
  refreshRecipes,
}) => {
  const [liked, setLiked] = useState(likedByUser);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLikeToggle = async () => {
    if (!token) {
      alert("Please log in to like recipes.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/recipe/${recipeId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(!liked);
        setLikeCount(data.likes);
        refreshRecipes(); // refresh state in parent
      } else if (res.status === 401) {
        alert("Unauthorized: Please login.");
      } else {
        console.error("Like failed", await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={handleLikeToggle}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
      {liked ? <FaHeart color="red" /> : <FaRegHeart />}
      <span style={{ marginLeft: "6px" }}>{likeCount}</span>
    </div>
  );
};

// CommentsSection Component
const CommentsSection = ({ recipeId, token, refreshRecipes }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipe/${recipeId}`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    };
    fetchComments();
  }, [recipeId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/recipe/${recipeId}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newComment }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
        setNewComment("");
        refreshRecipes(); // refresh state in parent
      } else {
        console.error("Failed to post comment", await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="comments-section" style={{ marginTop: "10px" }}>
      <h4>Comments</h4>

      <form
        onSubmit={handleCommentSubmit}
        className="comment-form"
        style={{ marginBottom: "10px" }}
      >
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!token}
        />
        <button type="submit" disabled={!token || !newComment.trim()}>
          Post
        </button>
      </form>

      <ul className="comments-list">
        {visibleComments.map(({ username, text, createdAt }, idx) => (
          <li key={idx} className="comment-item">
            <strong>{username || "Unknown User"}</strong>: {text}
            <div className="comment-date">
              {new Date(createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {comments.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            marginTop: "5px",
            background: "none",
            border: "none",
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {showAll ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

// Main Component
export default function Recipeitems() {
  const loadedRecipes = useLoaderData();
  const [allrecipes, setAllRecipes] = useState(loadedRecipes);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  let userId = user?.id;
  if (typeof userId === "object" && userId?.$oid) {
    userId = userId.$oid;
  }

  const token = localStorage.getItem("token");

  const fetchRecipes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/recipe`);
      setAllRecipes(res.data);
    } catch (err) {
      console.error("Error fetching recipes", err);
    }
  };

  useEffect(() => {
    setAllRecipes(loadedRecipes);
  }, [loadedRecipes]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/recipe/${id}`);
      await fetchRecipes(); // refresh after delete
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe.");
    }
  };

  return (
    <div className="card-container">
      {allrecipes?.map((item, index) => {
        let authorId = item.author;
        if (typeof authorId === "object" && authorId?.$oid) {
          authorId = authorId.$oid;
        }

        const isAuthor = authorId === userId;
        const likedByUser = item.likes.includes(userId);

        return (
          <div key={index} className="card" style={{ cursor: "pointer" }}>
            <img
              src={item.coverImage?.startsWith("http") ? item.coverImage : `${API_BASE_URL}/images/${item.coverImage}`}
              width="120px"
              height="100px"
              alt={item.title}
              className="card-image"
              onClick={() => navigate(`/FoodDetails/${item._id}`)}
            />
            <div className="card-body">
              <div className="title">{item.title}</div>
              <div
                className="icons"
                style={{ display: "flex", gap: "15px", alignItems: "center" }}
              >
                <RecipeLike
                  recipeId={item._id}
                  initialLikes={item.likes.length}
                  likedByUser={likedByUser}
                  token={token}
                  refreshRecipes={fetchRecipes}
                />

                {isAuthor && (
                  <>
                    <FaEdit
                      style={{ cursor: "pointer", color: "blue" }}
                      title="Edit"
                      onClick={() => navigate(`/EditRecipe/${item._id}`)}
                    />
                    <FaTrash
                      style={{ cursor: "pointer", color: "red" }}
                      title="Delete"
                      onClick={() => handleDelete(item._id)}
                    />
                  </>
                )}
              </div>

              <CommentsSection
                recipeId={item._id}
                token={token}
                refreshRecipes={fetchRecipes}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
