const express = require("express");
const router = express.Router();
const {
  createComment,
  getPostComments,
  deleteComment,
  likeComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: User interaction and discussions on posts
 */


/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get all comments on a specific post
 *     tags: [Comments]
 *     parameters:
 *       - $ref: '#/components/parameters/PostIdParam'
 *     responses:
 *       200:
 *         description: A list of comments for the post
 */
router.get("/:postId", getPostComments);

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PostIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentRequest'
 *     responses:
 *       201:
 *         description: Comment added successfully
 */
router.post("/:postId", protect, createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a user's own comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete("/:id", protect, deleteComment);

/**
 * @swagger
 * /api/comments/{id}/like:
 *   patch:
 *     summary: Like or unlike a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Comment like status toggled
 */
router.patch("/:id/like", protect, likeComment);

module.exports = router;