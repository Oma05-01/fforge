const express = require("express");
const router = express.Router();
const { registerUser, loginUser, createAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/create-admin", protect, isAdmin, createAdmin);

module.exports = router;