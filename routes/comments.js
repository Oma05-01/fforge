const express = require("express");
const router = express.Router();
const {
  createComment,
  getPostComments,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

// Get comments on a post — public
router.get("/:postId", getPostComments);

// Create comment — must be logged in
router.post("/:postId", protect, createComment);

// Delete own comment — must be logged in
router.delete("/:id", protect, deleteComment);

// Like/unlike a comment — must be logged in
router.patch("/:id/like", protect, likeComment);

module.exports = router;
