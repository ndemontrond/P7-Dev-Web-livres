const Book = require("../models/Book"); 
const fs = require("fs");

exports.createBook = async (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); 
    delete bookObject._id;
    delete bookObject._userId;
    try {
        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: req.processedImageUrl, // Use the processed image URL
        });
        await book.save();
        res.status(201).json({ message: "Livre enregistré !" });
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ error: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

exports.updateBook = async (req, res, next) => {
    try {
        // If there's a file, update with the new image URL
        const bookObject = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: req.processedImageUrl,
              }
            : { ...req.body };

        if (req.file) {
            const filename = book.imageUrl.split("/images/")[1];
            fs.unlinkSync(`images/${filename}`);
        }

        delete bookObject._userId;

        const book = await Book.findOne({ _id: req.params.id });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: "Not authorized" });
        }

        await Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id,  }
        );

        res.status(200).json({ message: "Livre modifié!" }); 
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book.userId != req.auth.userId) {
            res.status(401).json({ message: "Not authorized" });
        }
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, async () => {
            try {
                await Book.deleteOne({ _id: req.params.id });
                res.status(200).json({
                    message: "Livre supprimé !", 
                });
            } catch (error) {
                return res.status(401).json({ error });
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
        return books;
    } catch (error) {
        res.status(500).json({
            error: "An error has occurred while fetching all books",
        });
    }
};

exports.getBestRated = async (req, res, next) => {
    try {
        const topRatedBooksQuery = Book.find();
        topRatedBooksQuery.sort({ averageRating: -1 }); // Sort by averageRating in descending order
        topRatedBooksQuery.limit(3);
        const topRatedBooks = await topRatedBooksQuery.exec(); // Execute the query and await the result
        res.status(200).json(topRatedBooks);
    } catch (error) {
        res.status(500).json({
            error: "An error has occurred while fetching all books",
        });
    }
};

exports.rateBook = async (req, res, next) => {
    try {
        const { id, userId, rating } = req.params;

        // Check if the user has not already rated the book
        const existingRating = await Book.findOne({
            _id: id,
            "ratings.userId": userId,
        });
        if (existingRating) {
            return res
                .status(400)
                .json({ message: "User has already rated this book" });
        }

        const parsedRating = parseFloat(rating);
        // Check if the rating is a valid number between 0 and 5
        if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
            return res
                .status(400)
                .json({ message: "Rating must be a number between 0 and 5" });
        }

        // Retrieves the book to rate according to the id of the request
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Add a new rating to the book's ratings array
        book.ratings.push({ userId, grade: parsedRating });

        // Save the book to MongoDB, updating averageRating
        await book.save();

        res.status(200).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error has occurred" });
    }
};
