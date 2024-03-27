const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");

const bookCtrl = require("../controllers/book");

// Define routes corresponding to your frontend API_ROUTES
router.get("/", bookCtrl.getAllBooks); // Route for fetching all books
router.post("/", auth, multer, sharp, bookCtrl.createBook); // Route for creating a new book
router.get("/bestrating", bookCtrl.getBestRated); // Route for fetching best rated books
router.get("/:id", bookCtrl.getOneBook); // Route for fetching a single book by ID
router.put("/:id", auth, multer, sharp, bookCtrl.updateBook); // Route for updating a book
router.delete("/:id", auth, bookCtrl.deleteBook); // Route for deleting a book
router.post("/:id/rating", auth, bookCtrl.rateBook); // Route for rating a book

module.exports = router;
