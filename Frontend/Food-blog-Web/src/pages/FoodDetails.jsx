import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Foodimage from "../assets/foodRecipe.png";
import API_BASE_URL from "../config/api";

export default function FoodDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/recipe/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Failed to fetch recipe detail", err);
      }
    };
    fetchRecipe();
  }, [id]);

  // ✅ This prevents the error
  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="outerdiv">
      {/* Left Part */}
      <div className="Fleft">
        <div className="leftcontent">
          <div className="coverimages">
            <img
              src={recipe.coverImage?.startsWith("http") ? recipe.coverImage : `${API_BASE_URL}/images/${recipe.coverImage}`}
              alt="Food"
            />
          </div>
          <div className="appreciation">
            <p>❤️ {recipe.likes?.length ?? 0} Likes</p>
            <p>💬 {recipe.comments?.length ?? 0} Comments</p>
          </div>
        </div>
      </div>

      {/* Right Part */}
      <div className="Fright">
        <div className="titles">
          <h2>{recipe.title}</h2>
        </div>

        <div className="ingredients">
          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="steps">
          <h3>Steps</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: 0 }}>
            {recipe.steps.map((item, index) => (
              <li key={index}>
                <p>
                  <strong>{item.stepNumber}.</strong> {item.instruction}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="duration">
          <h3>Cooking Duration</h3>
          <p>{recipe.cookTime} minutes</p>
        </div>

        <div className="video">
          <h3>Video</h3>
          <iframe
            width="100%"
            height="450px"
            src={recipe.videoUrl}
            title="Recipe Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
