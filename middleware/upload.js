// middleware/upload.js
const multer = require("multer");
const path = require("path");

// 1. Configure where and how to save the local file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to a local 'uploads' folder
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // Give the file a unique name to prevent overwriting
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// 2. Filter out non-images (optional but highly recommended)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;