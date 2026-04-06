const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// @route   POST /api/posts
const createPost = async (req, res) => {
  const { title, content } = req.body;
  let imageUrl;

  try {
    if (req.file) {
      // 2. Upload the local file to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "blog_posts",
      });

      // 3. Save the secure URL provided by Cloudinary
      imageUrl = result.secure_url;

      // 4. Delete the file from your local 'uploads' folder to save space
      fs.unlinkSync(req.file.path);
    }
    
    const post = await Post.create({
      title,
      content,
      image: imageUrl,
      // req.user is available because this route is protected
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }
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

    if (post.image) {
      // Extract the public_id from the Cloudinary URL
      // This splits the URL by slashes, grabs the last part (the filename), 
      // and removes the .jpg/.png extension.
      const urlParts = post.image.split("/");
      const filename = urlParts[urlParts.length - 1].split(".")[0];
      
      // Reconstruct the public_id (folder_name/filename)
      const publicId = `blog_posts/${filename}`; 

      // Tell Cloudinary to destroy it!
      await cloudinary.uploader.destroy(publicId);
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