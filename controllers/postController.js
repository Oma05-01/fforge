const Post = require("../models/Post");

// @route   POST /api/posts
const createPost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      // req.user is available because this route is protected
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/posts
// Public — only returns published posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      // populate() replaces the author ID with the actual user data
      // we only grab username and profileImage, no sensitive fields
      .populate("author", "username profileImage")
      .sort({ createdAt: -1 }); // newest first

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/posts/my-posts
// Returns all posts (published or not) belonging to the logged-in user
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/posts/:id
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username profileImage bio"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PUT /api/posts/:id
const updatePost = async (req, res) => {
  const { title, content } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Convert both IDs to strings for comparison —
    // MongoDB ObjectIDs are objects, not strings, so === won't work directly
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/posts/:id/publish
// Toggles the published status between true and false
const togglePublish = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Flip whatever the current value is
    post.published = !post.published;
    await post.save();

    res.json({
      message: `Post ${post.published ? "published" : "unpublished"}`,
      published: post.published,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  togglePublish,
};