const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

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
        id: newUser._id,
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
        id: existingUser._id,
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
    const userId = req.params.id; // get from URL param

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const profileImage = req.file.filename;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    res.json({
      message: "Profile image updated",
      filename: profileImage,
      user: updatedUser,
    });
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
};
