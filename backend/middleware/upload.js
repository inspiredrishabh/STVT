const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, "../uploads/temp");
    // Ensure the temporary directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    // Temporary storage - will be moved by controller
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // Temporary filename - will be renamed by controller
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "temp-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  // On update, ensure ticket number is present in params or body
  if (req.method === "PUT") {
    const ticketNumber =
      req.params.ticketNumber || req.body.ticket_no || req.body.ticketNumber;
    if (!ticketNumber) {
      return cb(
        new Error("Ticket number is required for image update!"),
        false
      );
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
  fileFilter: fileFilter,
});

module.exports = upload;
