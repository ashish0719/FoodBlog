const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
  userLogin,
  userSignup,
  getuser,
  ProfilePicUpload,
  upload,
} = require("../controller/user");

router.post("/signup", userSignup);
router.get("/signup", (req, res) => {
  res.send("This is the signup page");
});

router.post("/login", userLogin);
router.get("/user/:id", getuser);

router.post(
  "/profile/:id/upload-profile",
  upload.single("profileImage"), // multer needs to parse file before auth uses req.body
  verifyToken,
  ProfilePicUpload
);

module.exports = router;
