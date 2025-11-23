const userModel = require("../models/user");

const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    if (currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following list
    currentUser.following.push(targetUserId);
    await currentUser.save();

    // Add to target user's followers list
    targetUser.followers.push(currentUserId);
    await targetUser.save();

    res.status(200).json({
      message: "Successfully followed user",
      following: currentUser.following.length,
      followers: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.userId;

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if following
    if (!currentUser.following.includes(targetUserId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    // Remove from following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );
    await currentUser.save();

    // Remove from target user's followers list
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    await targetUser.save();

    res.status(200).json({
      message: "Successfully unfollowed user",
      following: currentUser.following.length,
      followers: targetUser.followers.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel
      .findById(userId)
      .populate("followers", "username profileImage email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ followers: user.followers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userModel
      .findById(userId)
      .populate("following", "username profileImage email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ following: user.following });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user?.id;
    
    // If no current user, return all users without follow status
    if (!currentUserId) {
      const users = await userModel
        .find()
        .select("username profileImage email bio followers following")
        .limit(50);
      
      const usersWithCounts = users.map((user) => {
        const userObj = user.toObject();
        userObj.isFollowing = false;
        userObj.followersCount = user.followers.length;
        userObj.followingCount = user.following.length;
        return userObj;
      });
      
      return res.status(200).json({ users: usersWithCounts });
    }

    const currentUser = await userModel.findById(currentUserId);
    if (!currentUser) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const users = await userModel
      .find({ _id: { $ne: currentUserId } })
      .select("username profileImage email bio followers following")
      .limit(50);

    // Convert currentUserId to ObjectId for comparison
    const currentUserObjId = currentUser._id;

    // Add follow status for each user
    const usersWithFollowStatus = users.map((user) => {
      const userObj = user.toObject();
      // Check if current user is in this user's followers array
      userObj.isFollowing = user.followers.some(
        (followerId) => followerId.toString() === currentUserObjId.toString()
      );
      userObj.followersCount = user.followers.length;
      userObj.followingCount = user.following.length;
      return userObj;
    });

    res.status(200).json({ users: usersWithFollowStatus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getAllUsers,
};


