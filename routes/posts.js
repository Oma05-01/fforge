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

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Blog post management API
 */

/**
 * @swagger
 * /api/posts/my-posts:
 *   get:
 *     summary: Get all posts authored by the logged-in user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of the user's posts
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/my-posts", protect, getMyPosts);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Returns a list of all published posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: The list of posts
 */
router.get("/", getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by its ID
 *     tags: [Posts]
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: The post data
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", protect, updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post and its associated Cloudinary image
 *     tags: [Posts]
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
router.delete("/:id", protect, deletePost);

/**
 * @swagger
 * /api/posts/{id}/publish:
 *   patch:
 *     summary: Toggle the publish status of a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParam'
 *     responses:
 *       200:
 *         description: Post publish status toggled
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch("/:id/publish", protect, togglePublish);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post with an image upload
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               content:
 *                 type: string
 *                 description: The main content of the post
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Server error
 */
router.post("/", protect, upload.single("image"), createPost);

module.exports = router;