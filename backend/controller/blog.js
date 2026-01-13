const BlogModel = require("../models/blog");
const UserModel = require("../models/user");

const createBlog = async function (req, res) {
  const { title, content, tags } = req.body;
  const userId = req.user.id;

  try {
    // Parse tags if it's a string
    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map((tag) => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    let image = req.file ? req.file.filename : "";
    if (!image && req.body.image) {
      image = req.body.image;
    }

    const blog = new BlogModel({
      title,
      content,
      image,
      author: userId,
      tags: tagsArray,
    });

    const savedBlog = await blog.save();
    await savedBlog.populate("author", "username profileImage");
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBlogs = async function (req, res) {
  try {
    const blogs = await BlogModel.find()
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBlogById = async function (req, res) {
  try {
    const blog = await BlogModel.findById(req.params.id).populate(
      "author",
      "username profileImage bio"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
};
