const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true
    },

    picture: {
      type: String,   
      default: ""
    },
    friendRequests:[ { type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friends:[ { type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },

  {
    timestamps: true 
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel
