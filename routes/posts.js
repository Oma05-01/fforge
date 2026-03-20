const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePublish,
} = require("../controllers/postController");
const { protect } = require("../middleware/auth");

// Public
router.get("/", getAllPosts);

// Protected — must be logged in
router.post("/", protect, createPost);
router.get("/my-posts", protect, getMyPosts);
router.get("/:id", getPostById);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.patch("/:id/publish", protect, togglePublish);

module.exports = router;
