const ChatModel = require("../models/chatmodel");

async function sendMessage(req, res) {
  try {
    const { receiver, message } = req.body;
    const sender = req.user?.user_id||{}; 

    if (!receiver || !message) {
      return res.status(400).json({ error: "receiver and message required" });
    }

    const chat = await ChatModel.create({ sender, receiver, message });
    res.json({ message: "sent", data: chat });

  } catch (err) {
    console.error("sendMessage error:", err);
    res.status(500).json({ error: "server error" });
  }
}

async function getChatHistory(req, res) {
  try {
    const userId = req.user.user_id||{};
    const { otherUserId } = req.params;

    const chats = await ChatModel.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json({ data: chats });

  } catch (err) {
    console.error("getChatHistory error:", err);
    res.status(500).json({ error: "server error" });
  }
}

module.exports = {sendMessage, getChatHistory}
