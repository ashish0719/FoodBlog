const RecipeModel = require("../models/recipe");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const getRecipes = async function (req, res) {
  const recipes = await RecipeModel.find();
  return res.json(recipes);
};

const getRecipe = async function (req, res) {
  try {
    const recipe = await RecipeModel.findById(req.params.id).populate(
      "comments.user",
      "username"
    ); // 💡 Populates only the username of each user in comments

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Optional: Map and send simplified comment objects
    const response = {
      ...recipe.toObject(),
      comments: recipe.comments.map((comment) => ({
        username: comment.user?.username || "Unknown",
        text: comment.text,
        createdAt: comment.createdAt,
      })),
    };

    return res.json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const addRecipes = async function (req, res) {
  try {
    const {
      title,
      ingredients: ingredientsString,
      steps: stepsString,
      cookTime,
      prepTime,
      servings,
      cuisine,
      category,
      mainVideo,
      description,
    } = req.body;

    if (!title || !ingredientsString || !stepsString || !cookTime) {
      return res.status(400).json({ message: "Fill every detail properly." });
    }

    // Parse JSON strings for ingredients and steps
    const ingredients = JSON.parse(ingredientsString);
    const steps = JSON.parse(stepsString);

    let coverImage = req.file ? req.file.filename : "";
    if (!coverImage && req.body.coverImage) {
      coverImage = req.body.coverImage;
    }

    const newRecipe = await RecipeModel.create({
      title,
      description,
      ingredients,
      steps,
      cookTime,
      prepTime,
      servings,
      cuisine,
      category,
      videoUrl: mainVideo,
      coverImage,
      author: req.user.id,
    });

    return res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const editRecipes = async function (req, res) {
  try {
    const { id } = req.params;

    // Copy body
    const updateData = { ...req.body };

    // Parse ingredients and steps if they exist (since they come as JSON strings)
    if (updateData.ingredients) {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }
    if (updateData.steps) {
      updateData.steps = JSON.parse(updateData.steps);
    }

    // Update coverImage if file uploaded
    if (req.file) {
      updateData.coverImage = req.file.filename;
    } else if (req.body.coverImage) {
      updateData.coverImage = req.body.coverImage;
    }

    const updatedRecipe = await RecipeModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteRecipes = async (req, res) => {
  try {
    const deleted = await RecipeModel.deleteOne({ _id: req.params.id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ status: "ok" });
  } catch (err) {
    return res.status(400).json({ message: "error", error: err.message });
  }
};

const likeRecipes = async (req, res) => {
  try {
    const userId = req.user.id; // from middleware
    const recipeId = req.params.id;

    const recipe = await RecipeModel.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    let liked;

    // Toggle like
    const index = recipe.likes.indexOf(userId);
    if (index === -1) {
      recipe.likes.push(userId); // Like
      liked = true;
    } else {
      recipe.likes.splice(index, 1); // Unlike
      liked = false;
    }

    await recipe.save(); // ✅ Save the updated recipe!

    res.status(200).json({
      message: liked ? "Recipe liked" : "Recipe unliked",
      liked,
      likes: recipe.likes.length, // ✅ Provide updated count
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error liking recipe", error: error.message });
  }
};

const AddComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Add the new comment with user reference
    recipe.comments.push({
      user: userId,
      text,
    });

    // Save the updated recipe
    await recipe.save();

    // Populate the user details inside comments
    await recipe.populate("comments.user", "username");

    // Map comments to only include username, text and createdAt
    const responseComments = recipe.comments.map((comment) => ({
      username: comment.user?.username || "Unknown",
      text: comment.text,
      createdAt: comment.createdAt,
    }));

    // Send back updated comments array
    res.status(201).json({ comments: responseComments });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

module.exports = {
  getRecipes,
  addRecipes,
  editRecipes,
  deleteRecipes,
  getRecipe,
  likeRecipes,
  AddComment,
  upload,
};
