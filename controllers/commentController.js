const Comment = require("../models/Comment");
const Post = require("../models/Post");

// @route   POST /api/comments/:postId
const createComment = async (req, res) => {
  const { content } = req.body;

  try {
    // First check the post actually exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: req.params.postId,
    });

    // Populate author details before sending back
    await comment.populate("author", "username profileImage");

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/comments/:postId
const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/comments/:id/like
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if this user's ID is already in the likes array
    const alreadyLiked = comment.likes.some(
      (userId) => userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      // Unlike — filter their ID out of the array
      comment.likes = comment.likes.filter(
        (userId) => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Like — push their ID into the array
      comment.likes.push(req.user._id);
    }

    await comment.save();

    res.json({
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      likesCount: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getPostComments, deleteComment, likeComment };