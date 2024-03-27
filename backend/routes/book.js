const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sharp = require("../middleware/sharp-config");

const bookCtrl = require("../controllers/book");

// Define routes corresponding to your frontend API_ROUTES
// router.get("/", auth, bookCtrl.getAllBooks); // Route for fetching all books
router.get("/", bookCtrl.getAllBooks); // Route for fetching all books
router.post("/", auth, multer, sharp, bookCtrl.createBook); // Route for creating a new book
router.get("/:id", bookCtrl.getOneBook); // Route for fetching a single book by ID / Auth deleted
router.put("/:id", auth, multer, sharp, bookCtrl.updateBook); // Route for updating a book
router.delete("/:id", auth, bookCtrl.deleteBook); // Route for deleting a book
// routes commented out throw Error: Route.put() requires a callback function but got a [object Undefined] / auth

module.exports = router;
