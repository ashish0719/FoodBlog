const express = require("express");
const {
  getRecipes,
  addRecipes,
  editRecipes,
  deleteRecipes,
  getRecipe,
  likeRecipes,
  AddComment,

  upload,
} = require("../controller/recipe");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.get("/:id", getRecipe);
router.get("/", getRecipes);
router.post("/", verifyToken, upload.single("coverImage"), addRecipes);

router.put("/:id", upload.single("coverImage"), editRecipes);
router.delete("/:id", deleteRecipes);
router.post("/:id/like", verifyToken, likeRecipes);
router.post("/:id/comment", verifyToken, AddComment);

module.exports = router;
