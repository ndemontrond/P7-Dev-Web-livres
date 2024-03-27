const multer = require("multer");

const storage = multer.memoryStorage();
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

const fileFilter = (req, file, callback) => {
    if (MIME_TYPES[file.mimetype]) {
        callback(null, true);
    } else {
        callback(new Error("Invalid file type."));
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
    "image"
);

module.exports = upload;