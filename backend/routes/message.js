const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { sendMessage, getMessages, getConversations } = require("../controller/message");

router.post("/send", verifyToken, sendMessage);
router.get("/conversations", verifyToken, getConversations);
router.get("/:userId", verifyToken, getMessages);

module.exports = router;


