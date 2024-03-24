const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// const stuffCtrl = require("../controllers/stuff");
const bookCtrl = require("../controllers/book");

// router.get("/", auth, stuffCtrl.getAllThings);
// router.post("/", auth, multer, stuffCtrl.createThing);
// router.get("/:id", auth, stuffCtrl.getOneThing);
// router.put("/:id", auth, multer, stuffCtrl.modifyThing);
// router.delete("/:id", auth, stuffCtrl.deleteThing);

// Define routes corresponding to your frontend API_ROUTES
// router.get("/", auth, bookCtrl.getAllBooks); // Route for fetching all books
router.get("/", bookCtrl.getAllBooks); // Route for fetching all books
router.post("/", multer, bookCtrl.createBook); // Route for creating a new book
// router.get("/:id", auth, bookCtrl.getBookById); // Route for fetching a single book by ID
// router.put("/:id", auth, multer, bookCtrl.updateBook); // Route for updating a book
// router.delete("/:id", auth, bookCtrl.deleteBook); // Route for deleting a book
// routes commented out throw Error: Route.put() requires a callback function but got a [object Undefined]

module.exports = router;
