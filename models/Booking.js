const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movies",
  },
  status:{
     type: String, enum: ['Confirmed', 'cancelled']
  },
  seat: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  

}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
