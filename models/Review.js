const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movies",
    required: true
  },
}, { timestamps: true });
/* reviewSchema.index(
  { user: 1, movie: 1 },
  { unique: true }); */

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
