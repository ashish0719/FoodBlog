const MessageModel = require("../models/message");
const userModel = require("../models/user");
const { encrypt, decrypt } = require("../utils/encryption");

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: "Receiver ID and content required" });
    }

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot send message to yourself" });
    }

    const receiver = await userModel.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    // Encrypt the message content
    const encryptedContent = encrypt(content);

    const message = new MessageModel({
      sender: senderId,
      receiver: receiverId,
      content: encryptedContent,
    });

    await message.save();
    await message.populate("sender", "username profileImage");
    await message.populate("receiver", "username profileImage");

    // Decrypt for response (so frontend receives decrypted)
    const messageObj = message.toObject();
    messageObj.content = decrypt(messageObj.content);

    res.status(201).json(messageObj);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    const messages = await MessageModel.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate("sender", "username profileImage")
      .populate("receiver", "username profileImage")
      .sort({ createdAt: 1 });

    // Mark messages as read
    await MessageModel.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false,
      },
      { read: true }
    );

    // Decrypt all messages
    const decryptedMessages = messages.map((msg) => {
      const msgObj = msg.toObject();
      msgObj.content = decrypt(msgObj.content);
      return msgObj;
    });

    res.status(200).json({ messages: decryptedMessages });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Get all unique users the current user has messaged with
    const messages = await MessageModel.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate("sender", "username profileImage")
      .populate("receiver", "username profileImage")
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId =
        message.sender._id.toString() === currentUserId
          ? message.receiver._id.toString()
          : message.sender._id.toString();

      // Decrypt message content
      const decryptedMessage = {
        ...message.toObject(),
        content: decrypt(message.content),
      };

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user:
            message.sender._id.toString() === currentUserId
              ? message.receiver
              : message.sender,
          lastMessage: decryptedMessage,
          unreadCount: 0,
        });
      }

      // Update unread count
      if (
        message.receiver._id.toString() === currentUserId &&
        !message.read
      ) {
        conversationsMap.get(partnerId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
};

