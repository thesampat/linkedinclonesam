const { OAuth2Client } = require("google-auth-library");
const UserModel = require("../models/usermodel");

const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

const googleAuth=async(req, res, next)=> {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const token = header.split(" ")[1]; 

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub } = payload;

    let user = await UserModel.findOne({ email });

      if (!user) {
        console.log('no user found')
      }

    req.user = user?._id; 
    next();

  } catch (err) {
    console.log("Google token verify error:", err);
    return res.status(401).json({ message: "Invalid Google token" });
  }
}


module.exports = googleAuth