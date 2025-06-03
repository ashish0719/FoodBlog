import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import FoodDetails from "./pages/Fooddetails";
import Profile from "./pages/profile";

const getAllRecipes = async () => {
  const res = await axios.get("http://localhost:8000/recipe");
  return res.data;
};

const getMyRecipes = async () => {
  let user = JSON.parse(localStorage.getItem("user"));
  let userId = user.id;
  if (typeof userId === "object" && userId.$oid) {
    userId = userId.$oid;
  }

  let allRecipes = await getAllRecipes();

  return allRecipes.filter((recipe) => {
    let authorId = recipe.author;
    if (typeof authorId === "object" && authorId.$oid) {
      authorId = authorId.$oid;
    }
    return authorId === userId;
  });
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home /> }, // You can add loader later
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/EditRecipe/:id", element: <EditRecipe></EditRecipe> },
      { path: "/FoodDetails/:id", element: <FoodDetails></FoodDetails> },
      { path: "/profile", element: <Profile /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
