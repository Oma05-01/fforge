const express = require("express");
const router = express.Router();
const {
  getAnalytics,
  adminDeletePost,
  adminDeleteComment,
  unpublishPost,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Administrator dashboard and moderation tools
 */

router.use(protect, isAdmin);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get platform-wide analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
router.get("/analytics", getAnalytics);

/**
 * @swagger
 * /api/admin/posts/{id}:
 *   delete:
 *     summary: Force delete any user's post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/posts/:id", adminDeletePost);

/**
 * @swagger
 * /api/admin/comments/{id}:
 *   delete:
 *     summary: Force delete any user's comment
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/comments/:id", adminDeleteComment);

/**
 * @swagger
 * /api/admin/posts/{id}/unpublish:
 *   patch:
 *     summary: Force unpublish a post
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Post unpublished successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/posts/:id/unpublish", unpublishPost);

module.exports = router;