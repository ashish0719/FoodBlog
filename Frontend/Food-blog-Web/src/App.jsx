import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import MainNavigation from "./components/MainNavigation";
import axios from "axios";
import AddFoodRecipe from "./pages/AddFoodRecipe";
import EditRecipe from "./pages/EditRecipe";
import FoodDetails from "./pages/FoodDetails";

import MyProfile from "./pages/MyProfile";
import UserProfile from "./pages/UserProfile";
import BlogingCard from "./pages/blogingCard"; // Capitalized
import Users from "./pages/Users";
import Chat from "./pages/Chat";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import API_BASE_URL from "./config/api";

const getAllRecipes = async () => {
  const res = await axios.get(`${API_BASE_URL}/recipe`);
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
      { path: "/profile", element: <MyProfile /> },
      { path: "/user/:id", element: <UserProfile /> },
      { path: "/blogs", element: <BlogingCard /> },
      { path: "/blogs/create", element: <CreateBlog /> },
      { path: "/blogs/:id", element: <BlogDetail /> },
      { path: "/users", element: <Users /> },
      { path: "/chat/:userId", element: <Chat /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
