const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  title: {
    type: String, 
  },
  description: {
    type: String,
  },
  genre: {
    type: String,
  },
  price: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  poster: {
    type: String,
  },
  showtimes: [{
      date: Date,
      time: String,
  }],
  language: {
    type: String,
  },
  agerating: {
    type: String,
  },
  cast: [{
    type: String,
  }],

}, {timestamps: true});

const Movies = mongoose.model("Movies", moviesSchema);

module.exports = Movies;
