const { OAuth2Client } = require("google-auth-library");
const UserModel = require("../models/usermodel");
const { default: mongoose } = require("mongoose");
const FriendModel = require("../models/friends");


const client = new OAuth2Client(process.env.WEB_CLIENT_ID);


const authUser = async (req, res) => {
  try {
    const { googleid } = req.body;
    if (!googleid) {
      return res.status(400).send({ message: "No Google token received" });
    }

    const ticket = await client.verifyIdToken({
      idToken: googleid,
      audience: process.env.WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub, exp } = payload;

    let user = await UserModel.findOne({ email }).lean();

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        picture,
        googleId: sub,
      });
    }


    const friendDoc = await FriendModel.findOne({ user: user?._id }).lean();

    return res.status(200).send({
      message: "User login successful",
      data: {...user, friends:friendDoc?.friends},
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message:'Invalid Google token'});
  }
};



const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.user;         
    const { friend_id } = req.body || {};

    if (!userId || !friend_id) {
      return res.status(400).json({ message: "Missing user_id or friend_id" });
    }

    const senderId = new mongoose.Types.ObjectId(userId);
    const receiverId = new mongoose.Types.ObjectId(friend_id);

    await FriendModel.updateOne(
      { user: senderId,  "friendRequests.friendId": { $ne: receiverId } },
      
      {
        $addToSet: {
          friendRequests: {
            friendId: receiverId,
            requestType: "sent",
          },
        },
      },{upsert:true}
    );

    await FriendModel.updateOne(
      { user: receiverId,  "friendRequests.friendId": { $ne: senderId } },
      {
        $addToSet: {
          friendRequests: {
            friendId: senderId,
            requestType: "received",
          },
        },
      }, {upsert:true}
    );

    return res.json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Friend request error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const acceptRejectFriendRequest = async (data) => {
  try {
    const { friend_id, status, user_id } = data||{}

    if (!user_id || !friend_id || !status) {
      return false
    }

    const userId = user_id;
    const friendId = friend_id;

    await FriendModel.updateOne(
      { user: userId },
      { $pull: { friendRequests: { friendId: friendId } } }
    );

    await FriendModel.updateOne(
      { user: friendId },
      { $pull: { friendRequests: { friendId: userId } } }
    );

    if (status === "accepted") {
      await FriendModel.updateOne(
        { user: userId },
        { $addToSet: { friends: friendId } }, {upsert:true}
      );
      await FriendModel.updateOne(
        { user: friendId },
        { $addToSet: { friends: userId } }, {upsert:true}
      );
    }

    console.log('accepted')
    return true;

  } catch (error) {
    console.error("Friend request action error:", error);
    return false;
  }
};


module.exports = { authUser, sendFriendRequest, acceptRejectFriendRequest}