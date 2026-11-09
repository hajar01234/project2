const router = require("express").Router();
const Movie = require("../models/Movies.js");
const isSignedIn = require("../middleware/is-signed-in.js");
const Booking = require("../models/Booking.js");

router.get("/new/:movieId/:showtimeId", isSignedIn, async (req, res) => {

    const foundMovie = await Movie.findById(req.params.movieId);

    if (!foundMovie) {
        return res.send("Movie not found");
    }


    const showtime = foundMovie.showtimes.find(
        (showtime) => showtime._id.equals(req.params.showtimeId)
    );

    console.log("Selected showtime:", showtime);

    if (!showtime) {
        return res.send("Showtime not found");
    }
    const existingBookings = await Booking.find({
        movie: foundMovie._id,
        showtime: showtime._id,
        status: "Confirmed"
    });
    const bookedSeats = existingBookings.flatMap(booking => booking.seats);

    res.render("bookings/new.ejs", {
        movie: foundMovie,
        showtime: showtime,
        bookedSeats: bookedSeats
    });
});
router.post("/", isSignedIn, async (req, res) => {
    try {
const { movieId, showtimeId } = req.body;

let seats = [];

if (Array.isArray(req.body.seats)) {
    seats = req.body.seats;
} else if (req.body.seats) {
    seats = [req.body.seats];
}
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.send("Movie not found");
        }

        const showtime = movie.showtimes.id(showtimeId);

        if (!showtime) {
            return res.send("Showtime not found");
        }

        if (!Array.isArray(seats) || seats.length < 1 || seats.length > 10) {
    return res.send("Invalid seats");
}

for (let i = 0; i < seats.length; i++) {
    const seat = seats[i];

    if (typeof seat !== "string" || seat.length !== 3) {
        return res.send("Invalid seats");
    }

    const row = seat[0];
    const number = Number(seat.slice(1));

    if (row < "A" || row > "U" || number < 1 || number > 26) {
        return res.send("Invalid seats");
    }

    if (seat.slice(1) !== String(number).padStart(2, "0")) {
        return res.send("Invalid seats");
    }

    for (let j = 0; j < i; j++) {
        if (seats[j] === seat) {
            return res.send("Invalid seats");
        }
    }
}        const existingBookings = await Booking.find({
            movie: movieId,
            showtime: showtimeId,
            status: "Confirmed",
            seats: { $in: seats }
        });
        console.log("Selected seats:", seats);

console.log("Existing bookings:", existingBookings.map(booking => ({
    seats: booking.seats,
    showtime: booking.showtime,
    status: booking.status
})));

        if (existingBookings.length > 0) {
            return res.send("Some seats are already booked");
        }
        const totalPrice = seats.length * movie.price;
        await Booking.create({
            user: req.session.user._id,
            movie: movieId,
            showtime: showtimeId,
            seats: seats,
            totalPrice: totalPrice
        });

res.send("Booking Confirmed!");

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});
router.get("/my-bookings", isSignedIn, async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.session.user._id
        }).populate("movie");

        console.log("My Bookings:", bookings.length);

        res.render("bookings/my-bookings.ejs", {
            bookings: bookings
        });

    } catch (error) {
        console.log("MY BOOKINGS ERROR:", error);
        res.send("Error loading bookings");
    }
});
router.get("/:bookingId", isSignedIn, async (req, res) => {

    const booking = await Booking.findOne({
        _id: req.params.bookingId,
        user: req.session.user._id
    }).populate("movie");

    if (!booking) {
        return res.send("Booking not found");
    }

    let showtime = null;

if (booking.movie) {
    showtime = booking.movie.showtimes.id(booking.showtime);
}

    res.render("bookings/show.ejs", {
        booking: booking,
        showtime: showtime
    });

});
router.get("/:bookingId/edit", isSignedIn, async (req, res) => {

    const booking = await Booking.findOne({
        _id: req.params.bookingId,
        user: req.session.user._id,
        status: "Confirmed"
    }).populate("movie");

    if (!booking) {
        return res.send("Booking not found");
    }

    if (!booking.movie) {
        return res.send("Movie not found");
    }

    const showtime = booking.movie.showtimes.id(booking.showtime);

    if (!showtime) {
        return res.send("Showtime not found");
    }
    const otherBookings = await Booking.find({
        _id: { $ne: booking._id },
        movie: booking.movie._id,
        showtime: booking.showtime,
        status: "Confirmed"
    });

    const bookedSeats = otherBookings.flatMap(
        otherBooking => otherBooking.seats
    );

    res.render("bookings/edit.ejs", {
        booking: booking,
        showtime: showtime,
        bookedSeats: bookedSeats
    });

});
router.put("/:bookingId", isSignedIn, async (req, res) => {
    try {
        const { showtimeId, seats } = req.body;
        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            user: req.session.user._id,
            status: "Confirmed"
        });

        if (!booking) {
            return res.send("Booking not found");
        }
        const movie = await Movie.findById(booking.movie);

        if (!movie) {
            return res.send("Movie not found");
        }
        const showtime = movie.showtimes.id(showtimeId);

        if (!showtime) {
            return res.send("Showtime not found");
        }

        if (
            !Array.isArray(seats) ||
            seats.length < 1 ||
            seats.length > 10 ||
            new Set(seats).size !== seats.length ||
            seats.some(seat => !/^[A-U](0[1-9]|1[0-9]|2[0-6])$/.test(seat))
        ) {
            return res.send("Invalid seats");
        }
        const existingBookings = await Booking.find({
            _id: { $ne: booking._id },
            movie: movie._id,
            showtime: showtimeId,
            status: "Confirmed",
            seats: { $in: seats }
        });

        if (existingBookings.length > 0) {
            return res.send("Some seats are already booked");
        }
        booking.showtime = showtimeId;
        booking.seats = seats;
        booking.totalPrice = seats.length * movie.price;

        await booking.save();

        res.send("Booking Updated!");

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});
router.get("/:bookingId/booked-seats/:showtimeId", isSignedIn, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.bookingId,
            user: req.session.user._id,
            status: "Confirmed"
        });

        if (!booking) {
            return res.json({ error: "Booking not found" });
        }

        const movie = await Movie.findById(booking.movie);

        if (!movie || !movie.showtimes.id(req.params.showtimeId)) {
            return res.json({ error: "Showtime not found" });
        }

        const otherBookings = await Booking.find({
            _id: { $ne: booking._id },
            movie: booking.movie,
            showtime: req.params.showtimeId,
            status: "Confirmed"
        });

        const bookedSeats = otherBookings.flatMap(
            otherBooking => otherBooking.seats
        );

        res.json({ bookedSeats });

    } catch (error) {
        console.log(error);
        res.json({ error: "Something went wrong" });
    }
});
router.patch("/:bookingId/cancel", isSignedIn, async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            {
                _id: req.params.bookingId,
                user: req.session.user._id,
                status: "Confirmed"
            },
            {
                $set: { status: "cancelled" }
            },
            { new: true }
        );

        if (!booking) {
            return res.send("Booking not found or already cancelled");
        }

        res.send("Booking Cancelled!");

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});
module.exports = router;