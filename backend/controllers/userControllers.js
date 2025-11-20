const { OAuth2Client } = require("google-auth-library");
const UserModel = require("../models/usermodel");

const authUser = async (req, res) => {
    const client = new OAuth2Client();
    let user

    const { googleid } = req.body || {}
    if (!googleid) {
        res.status(200).send('no token found')
    }

    const ticket = await client.verifyIdToken({
        idToken: googleid,
        audience: process.env.WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload || {}

    try {
        user = await UserModel.find({ email: email })
        if (!user) {
            user = await UserModel.create({ name, email, picture })
        }
    } catch (error) {
        res.status(500).send({ data: { message: "something went wrong" } })
    }

    res.cookie('Cookie', JSON.stringify({ exp: payload.exp, ...user }), {
        httpOnly: false,
        secure: false,
        sameSite: "lax",

    });
    res.status(200).send({ message: 'user login successfull', data: { user } })
    const userid = payload['sub'];
}


const sendFriendRequest = async (req, res) => {
    const { user_id } = req.user || {}
    const { friend_id } = req.body || {}

    if (!user_id && !friend_id) {
        res.status(400).send('something went wrong')
    }

    try {
        await UserModel.updateOne(user_id, { $push: { 'friendRequests': { friend_id: friend_id, requesttype: 'sent' } } })
        await UserModel.updateOne(friend_id, { $push: { 'friendRequests': { friend_id: user_id, requesttype: 'received' } } })
        res.send('request sent')
    } catch (error) {
        res.send({ data: { message: error?.response?.message || "something went wrong" } })
    }


}

const acceptRejectFriendRequest = async (req, res) => {
    const { user_id } = req.user || {}
    const { friend_id, status } = req.body || {}

    if (!user_id && !friend_id) {
        res.status(400).send('something went wrong')
    }

    try {
        await UserModel.updateOne(user_id, { $pull: { 'friendRequests': { friend_id: friend_id, requesttype: 'sent' } }, $push: { 'friends': friend_id } })
        await UserModel.updateOne(friend_id, { $pull: { 'friendRequests': { friend_id: user_id, requesttype: 'received' } }, $push: { 'friends': user_id } })

        if (status === 'accepted') {
            await UserModel.updateOne(user_id, { $push: { 'friends': friend_id } })
            await UserModel.updateOne(friend_id, { $push: { 'friends': user_id } })
        }
        res.send('request sent')
    } catch (error) {
        res.send({ data: { message: error?.response?.message || "something went wrong" } })
    }


}


module.exports = { authUser, sendFriendRequest, acceptRejectFriendRequest}