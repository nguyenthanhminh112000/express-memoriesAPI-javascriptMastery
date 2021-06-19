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

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage(post);
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
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(404).json({ message: 'No post with that ID' });
  } else {
    try {
      const post = await PostMessage.findById(_id);
      const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        {
          likeCount: post.likeCount + 1,
        },
        { new: true }
      );
      if (updatedPost) {
        res.json(updatedPost);
      } else {
        res.status(404).json({ message: 'No post with that ID' });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};
