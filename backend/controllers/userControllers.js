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

module.exports = { authUser }