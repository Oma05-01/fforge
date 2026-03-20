const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    // --- Basic counts ---
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();

    // --- Date helpers ---
    const now = new Date();

    // Start of today (midnight)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start of this week (last Monday midnight)
    // getDay() returns 0=Sun, 1=Mon ... 6=Sat
    // This calculation rolls back to the most recent Monday
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);

    // --- Activity today ---
    const postsToday = await Post.countDocuments({
      createdAt: { $gte: startOfToday },
    });
    const commentsToday = await Comment.countDocuments({
      createdAt: { $gte: startOfToday },
    });

    // --- Activity this week ---
    const postsThisWeek = await Post.countDocuments({
      createdAt: { $gte: startOfWeek },
    });
    const commentsThisWeek = await Comment.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    // --- Most liked comments ---
    // We can't simply sort by likes count since likes is an array,
    // so we use aggregation to add a computed field first, then sort by it
    const mostLikedComments = await Comment.aggregate([
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
      {
        // Aggregation pipeline doesn't support populate(), so we
        // manually join the users collection using $lookup
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      // $lookup returns author as an array — $unwind flattens it
      // to a single object
      { $unwind: "$author" },
      {
        $project: {
          content: 1,
          likesCount: 1,
          createdAt: 1,
          "author.username": 1,
          "author.profileImage": 1,
        },
      },
    ]);

    // --- All users with their post counts ---
    const usersWithPostCounts = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          postCount: { $size: "$posts" },
        },
      },
      { $sort: { postCount: -1 } },
    ]);

    res.json({
      overview: {
        totalUsers,
        totalPosts,
        totalComments,
      },
      activity: {
        postsToday,
        commentsToday,
        postsThisWeek,
        commentsThisWeek,
      },
      mostLikedComments,
      usersWithPostCounts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/admin/posts/:id
// Admin can force delete ANY post regardless of who owns it
const adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();

    // Also delete all comments that belonged to this post
    // since they're now orphaned (their post no longer exists)
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: "Post and its comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   DELETE /api/admin/comments/:id
const adminDeleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   PATCH /api/admin/posts/:id/unpublish
const unpublishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.published = false;
    await post.save();

    res.json({ message: "Post unpublished successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics, adminDeletePost, adminDeleteComment, unpublishPost };