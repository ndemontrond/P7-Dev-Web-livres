const Book = require("../models/Book"); // Change from "Thing" to "Book"
const fs = require("fs");

exports.createBook = async (req, res, next) => {
    // Change from createThing to createBook
    const bookObject = JSON.parse(req.body.book); // Change from thing to book
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
    // Change from getOneThing to getOneBook
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
        // Change from modifyThing to modifyBook
        const bookObject = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: req.processedImageUrl,
              }
            : { ...req.body };

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
            { ...bookObject, _id: req.params.id }
        );

        res.status(200).json({ message: "Livre modifié!" }); // Change message from "Objet" to "Livre"
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.deleteBook = async (req, res, next) => {
    // Change from deleteThing to deleteBook
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
                    message: "Livre supprimé !", // Change message from "Objet" to "Livre"
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
    // Change from getAllStuff to getAllBooks
    try {
        const books = await Book.find();
        res.status(200).json(books);
        return books;
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
