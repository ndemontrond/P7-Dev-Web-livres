const Book = require("../models/Book"); // Change from "Thing" to "Book"
const fs = require("fs");

exports.createBook = (req, res, next) => {
    // Change from createThing to createBook
    const bookObject = JSON.parse(req.body.book); // Change from thing to book
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        // Change from Thing to Book
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    book.save()
        .then(() => {
            res.status(201).json({ message: "Livre enregistré !" }); // Change message from "Objet" to "Livre"
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.getOneBook = (req, res, next) => {
    // Change from getOneThing to getOneBook
    Book.findOne({
        // Change from Thing to Book
        _id: req.params.id,
    })
        .then((book) => {
            res.status(200).json(book); // Change from thing to book
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            });
        });
};

exports.modifyBook = (req, res, next) => {
    // Change from modifyThing to modifyBook
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(
                        () =>
                            res.status(200).json({ message: "Livre modifié!" }) // Change message from "Objet" to "Livre"
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    // Change from deleteThing to deleteBook
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "Livre supprimé !", // Change message from "Objet" to "Livre"
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
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
