const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getAllUsers,
} = require("../controller/follow");

router.post("/:userId/follow", verifyToken, followUser);
router.post("/:userId/unfollow", verifyToken, unfollowUser);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.get("/", verifyToken, getAllUsers);

module.exports = router;


