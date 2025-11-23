// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  image: {
    type: String, // URL or path to the cover image
    default: "",
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  tags: [String], // optional: for categorizing blogs

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret._id = ret._id.toString();
    delete ret.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
