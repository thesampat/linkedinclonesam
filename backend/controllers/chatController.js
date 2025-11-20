const ChatModel = require("../models/chatmodel");

async function sendMessage(msg) {
  try {
    const { receiver, message, sender} = msg;

    if ((!receiver || !sender)) {
      throw 'receiver and sender required'
    }

    await ChatModel.create({ sender, receiver, message });
    return true

  } catch (err) {
    throw 'could not send message'
  }
}

async function getChatHistory(req, res) {
  try {
    const userId = req.user||{};
    const { otherUserId } = req.params;

    console.log(userId, otherUserId)
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
