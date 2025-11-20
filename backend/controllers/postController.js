const fs = require('fs');
const PostModel = require('../models/postmodel');

const create_post = async (req, res) => {
  try {
    const { content } = req.body;
    const {user_id} = req.user
    const file = req.file; 

    if (!content && !file &&!user_id) {
      return res.status(400).send({ message: "Esomething went wrong" });
    }

    const newPost = await PostModel.create({
      content,
      owner:user_id, 
      file: file ? `uploads/${file.filename}` : null,
    });

    res.send({ message: "Post created", data: newPost });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server error" });
  }
};


const update_post = async (req, res) => {
  try {
    const { id } = req.params;
    const {content} = req.body||{}

    const post = await PostModel.findByIdAndUpdate(
      id,
      {
        content: content,
        file: req.file ? `uploads/${req.file.filename}` : undefined,
      },
      { new: true }
    );

    res.send({ message: "Post updated", data: post });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

const delete_post = async (req, res) => {
  try {
    const { id } = req.params;
    await PostModel.findByIdAndDelete(id);

    res.send({ message: "Post deleted" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

const get_all_posts = async (req, res) => {
  try {
    console.log(req.cookies, 'what is cookies')
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.send({ data: posts });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = { create_post, get_all_posts, update_post, delete_post}