const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  userLogin,
  userSignup,
  getuser,
  ProfilePicUpload,
  upload,
  getUserProfile,
  updateUsername,
  getUserRecipes,
  getUserBlogs,
} = require("../controller/user");

router.post("/signup", userSignup);
router.get("/signup", (req, res) => {
  res.send("This is the signup page");
});

router.post("/login", userLogin);
router.get("/user/:id", getuser);

// Profile routes - specific routes first, then general ones
router.post(
  "/profile/:id/upload-profile",
  verifyToken,
  upload.single("profileImage"),
  ProfilePicUpload
);

router.get("/profile/:id/recipes", getUserRecipes);
router.get("/profile/:id/blogs", getUserBlogs);
router.get("/profile/:id", getUserProfile);
router.put("/profile/username", verifyToken, updateUsername);

module.exports = router;
