const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    // Change from thingSchema to bookSchema
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{ userId: { type: String }, grade: { type: Number } }],
    averageRating: { type: Number },
});

bookSchema.pre('save', function (next) {
  const ratings = this.ratings.map(rating => rating.grade);
  
  // Calculate sum of ratings using Array.reduce
  const sumOfRatings = ratings.reduce((acc, curr) => acc + curr, 0);

  // Calculate average rating
  this.averageRating = ratings.length
      ? Math.round(sumOfRatings / ratings.length)
      : 0;

  // Call next to proceed with the save operation
  next();
});

module.exports = mongoose.model("Book", bookSchema); // Change from "Thing" to "Book"
