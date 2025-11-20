const fs = require('fs');
const PostModel = require('../models/postmodel');
const { default: mongoose } = require('mongoose');
const { error } = require('console');

const create_post = async (req, res) => {
  try {
    const { content } = req.body;
    const user_id = req.user
    const file = req.files?.[0];


    if ((!content || !file) && !user_id) {
      return res.status(400).send({ message: "something went wrong" });
    }

    const newPost = await PostModel.create({
      content,
      author: user_id,
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
    const { content } = req.body || {}
    const user_id = req.user

    const post = await PostModel.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        author: new mongoose.Types.ObjectId(user_id)
      },
      {
        content: content,
        file: req.file ? `uploads/${req.file.filename}` : undefined,
      },
      { new: true }
    );


    if (!post) {
      return res.status(404).send({
        message: "Post not found or you are not the owner",
      });
    }


    res.send({ message: "Post updated", data: post });
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: "Server error" });
  }
};

const delete_post = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user

    const post = await PostModel.findOneAndDelete(
      {
        _id: new mongoose.Types.ObjectId(id),
        author: new mongoose.Types.ObjectId(user_id)
      }
    );

    if (!post) {
      return res.status(404).send({
        message: "Post not found or you are not the owner",
      });
    }


    res.send({ message: "Post deleted" });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

const get_all_posts = async (req, res) => {
  const user = req.user
  try {
    console.log(req.cookies, 'what is cookies')
    const posts = await PostModel.find().sort({ createdAt: -1 });
    res.send({ data: posts });
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = { create_post, get_all_posts, update_post, delete_post }
