const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + `_${file.originalname}`;
    cb(null, filename);
  }, // Use the original filename
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("Unsupported file type!"), false);
      return;
    }
    cb(null, true);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 3 },
});

module.exports = upload;
