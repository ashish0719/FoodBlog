const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const multer = require("multer");
const { createBlog, getAllBlogs, getBlogById } = require("../controller/blog");

// Use multer to upload blog image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + "-coverImage";
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post(
  "/create",
  verifyToken,
  upload.single("image"), // name of file input field in frontend
  createBlog
);

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

module.exports = router;
