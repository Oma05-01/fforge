const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
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
router.get("/:id", getPostById);

// Protected — must be logged in
router.get("/my-posts", protect, getMyPosts);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.patch("/:id/publish", protect, togglePublish);

// COMBINED ROUTE: Auth checks token -> Multer parses image -> Controller saves post
router.post("/", protect, upload.single("image"), createPost);

module.exports = router;