const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");
const RecipeModel = require("../models/recipe");
const BlogModel = require("../models/blog");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/profilepics");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-" + file.fieldname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const userSignup = async function (req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    const token = jwt.sign({ email, id: newUser._id }, process.env.SECERET_KEY);

    res.status(201).json({
      token,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email, id: existingUser._id },
      process.env.SECERET_KEY, // Also fix typo here: it was `SECERET_KEY`
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: {
        id: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

const getuser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const ProfilePicUpload = async (req, res) => {
  try {
    console.log("Upload request received for user:", req.params.id);

    if (!req.file) {
      console.log("❌ No file received!");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File uploaded:", req.file);

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { profileImage: req.file.filename },
      { new: true }
    );

    console.log("User updated:", updatedUser);

    res.json({
      message: "Profile image updated",
      user: updatedUser,
    });
  } catch (error) {
    console.log("❌ ERROR in upload:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel
      .findById(userId)
      .select("username email profileImage bio followers following createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get counts
    const recipesCount = await RecipeModel.countDocuments({ author: userId });
    const blogsCount = await BlogModel.countDocuments({ author: userId });

    const userObj = user.toObject();
    // Ensure _id is a string
    userObj._id = userObj._id.toString();
    userObj.followersCount = user.followers.length;
    userObj.followingCount = user.following.length;
    userObj.recipesCount = recipesCount;
    userObj.blogsCount = blogsCount;

    res.status(200).json(userObj);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUsername = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Check if username is already taken
    const existingUser = await userModel.findOne({
      username: username.trim(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { username: username.trim() },
      { new: true }
    );

    res.status(200).json({
      message: "Username updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.id;
    const recipes = await RecipeModel.find({ author: userId })
      .select("title coverImage createdAt likes")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserBlogs = async (req, res) => {
  try {
    const userId = req.params.id;
    const blogs = await BlogModel.find({ author: userId })
      .select("title image createdAt")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  userSignup,
  userLogin,
  getuser,
  upload,
  ProfilePicUpload,
  getUserProfile,
  updateUsername,
  getUserRecipes,
  getUserBlogs,
};
