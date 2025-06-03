const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    steps: [
      {
        stepNumber: Number,
        instruction: String,
        image: String, // Optional image for this step
        videoUrl: String, // Optional video per step
      },
    ],
    coverImage: {
      type: String,
    },
    videoUrl: {
      type: String, // Optional main recipe video
    },
    cookTime: {
      type: String,
    },
    prepTime: {
      type: String,
    },
    servings: {
      type: Number,
      default: 1,
    },
    cuisine: {
      type: String,
    },
    category: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
