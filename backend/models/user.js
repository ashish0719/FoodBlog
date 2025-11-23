const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
  },

  profileImage: {
    type: String, // URL or path to image
    default: "",
  },

  bio: {
    type: String,
    default: "",
  },

  savedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],

  likedRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add this just before exporting
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString(); // convert ObjectId to string
    delete ret.__v; // optional: remove __v field
    delete ret.password; // optional: remove password from JSON responses for security
  },
});

module.exports = mongoose.model("User", userSchema);
