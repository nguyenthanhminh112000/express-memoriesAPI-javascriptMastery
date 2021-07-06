import mongoose from 'mongoose';
import PostMessage from './../models/postMessage.js';

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, 'i');
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(',') } }],
    });
    if (Array.isArray(posts) && posts.length === 0)
      return res.status(404).json({ message: "Couldn't find any posts." });
    return res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({ ...post, creator: req.userId });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = { ...req.body, _id };
  // check is id an mongoose-Object-ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json({ message: 'No post with that ID' });
  } else {
    try {
      const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
        new: true,
      });
      res.json(updatedPost);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json({ message: 'No post with that ID' });
  } else {
    try {
      const deletedDocument = await PostMessage.findByIdAndRemove(_id);
      if (deletedDocument) {
        res.status(200).json({ message: 'Success delete' });
      } else {
        res.status(404).json({ message: 'No post with that ID' });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

export const likePost = async (req, res) => {
  console.log('achieved');

  if (!req.userId) {
    return res.status(404).json({ message: 'Unauthenticated' });
  }
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: 'No post with that ID' });
  }
  try {
    const post = await PostMessage.findById(_id);
    if (!post) {
      return res.status(404).json({ message: 'No post with that ID' });
    }
    const index = post.likes.findIndex(
      (userId) => userId === String(req.userId)
    );
    if (index === -1) {
      // like the post
      post.likes.push(req.userId);
    } else {
      // unlike the post
      post.likes.splice(index, 1);
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    return res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
