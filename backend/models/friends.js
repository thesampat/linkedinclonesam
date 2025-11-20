const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    friendRequests: [
      {
        friendId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        requestType: { type: String, enum: ["sent", "received"] },
      }
    ],
    friends: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
  },

  { timestamps: true }
);

const FriendModel = mongoose.model("Friends", friendSchema);
module.exports = FriendModel;
