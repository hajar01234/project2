const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movies",
  },
  status:{
     type: String, enum: ['Confirmed', 'cancelled'],
     default: 'Confirmed'
  },
  seats: {
    type: [String],
  },
  totalPrice: {
    type: Number,
  },
  showtime: {
  type: mongoose.Schema.Types.ObjectId,
  required: true
},
  

}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
