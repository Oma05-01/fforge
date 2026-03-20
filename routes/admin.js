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

// All admin routes are protected by both middlewares —
// you must be logged in AND be an admin to access any of these
router.use(protect, isAdmin);

router.get("/analytics", getAnalytics);
router.delete("/posts/:id", adminDeletePost);
router.delete("/comments/:id", adminDeleteComment);
router.patch("/posts/:id/unpublish", unpublishPost);

module.exports = router;
