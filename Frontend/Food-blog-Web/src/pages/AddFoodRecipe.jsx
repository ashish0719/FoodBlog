import { useState } from "react";
import React from "react";
import styles from "./AddFoodRecipe.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddFoodRecipe() {
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: "" }]);
  const [recipeData, setRecipeData] = useState({});
  const [coverImageFile, setCoverImageFile] = useState(null);
  const navigate = useNavigate();

  const handleIngredientChange = (index, e) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = e.target.value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const newSteps = [...steps];
    newSteps[index][name] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, instruction: "" }]);
  };

  const onHandleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      // Removed the show-login event dispatching
      return; // Just stop submission if no token
    }

    const formData = new FormData();
    formData.append("title", recipeData.title || "");
    formData.append("description", recipeData.description || "");
    formData.append("ingredients", JSON.stringify(ingredients));
    formData.append("steps", JSON.stringify(steps));
    if (coverImageFile) {
      formData.append("coverImage", coverImageFile);
    }
    formData.append("mainVideo", recipeData.mainVideo || "");
    formData.append("cookTime", recipeData.cookTime || "");
    formData.append("prepTime", recipeData.prepTime || "");
    formData.append("servings", recipeData.servings || "");
    formData.append("cuisine", recipeData.cuisine || "");
    formData.append("category", recipeData.category || "");

    try {
      await axios.post("http://localhost:8000/recipe", formData, {
        headers: {
          authorization: "bearer " + localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        // Removed the show-login event dispatching
      } else {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add Food Recipe</h1>
      <form className={styles.form} onSubmit={handleOnSubmit}>
        <input
          name="title"
          placeholder="Title"
          className={styles.input}
          value={recipeData.title || ""}
          onChange={onHandleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          className={styles.textarea}
          value={recipeData.description || ""}
          onChange={onHandleChange}
        />

        <div className={styles.sectionTitle}>Ingredients</div>
        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            placeholder={`Ingredient ${index + 1}`}
            className={styles.input}
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e)}
          />
        ))}
        <button type="button" className={styles.button} onClick={addIngredient}>
          + Add Ingredient
        </button>

        <div className={styles.sectionTitle}>Steps</div>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepContainer}>
            <input
              type="number"
              name="stepNumber"
              placeholder="Step Number"
              className={styles.input}
              value={step.stepNumber}
              onChange={(e) => handleStepChange(index, e)}
            />
            <textarea
              name="instruction"
              placeholder="Instruction"
              className={styles.textarea}
              value={step.instruction}
              onChange={(e) => handleStepChange(index, e)}
            />
          </div>
        ))}
        <button type="button" className={styles.button} onClick={addStep}>
          + Add Step
        </button>

        <input
          type="file"
          name="coverImage"
          accept="image/*"
          className={styles.input}
          onChange={handleFileChange}
        />
        <input
          name="mainVideo"
          placeholder="Main Video URL"
          className={styles.input}
          value={recipeData.mainVideo || ""}
          onChange={onHandleChange}
        />
        <input
          name="cookTime"
          placeholder="Cook Time"
          className={styles.input}
          value={recipeData.cookTime || ""}
          onChange={onHandleChange}
        />
        <input
          name="prepTime"
          placeholder="Prep Time"
          className={styles.input}
          value={recipeData.prepTime || ""}
          onChange={onHandleChange}
        />
        <input
          type="number"
          name="servings"
          placeholder="Servings"
          className={styles.input}
          value={recipeData.servings || ""}
          onChange={onHandleChange}
        />
        <input
          name="cuisine"
          placeholder="Cuisine"
          className={styles.input}
          value={recipeData.cuisine || ""}
          onChange={onHandleChange}
        />
        <input
          name="category"
          placeholder="Category"
          className={styles.input}
          value={recipeData.category || ""}
          onChange={onHandleChange}
        />

        <button type="submit" className={styles.button}>
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
