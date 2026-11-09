const router = require("express").Router();
const Review = require("../models/Review.js");
const Movie = require("../models/Movies.js");
const isSignedIn = require("../middleware/is-signed-in.js");

router.get("/", isSignedIn, async (req, res) => {
    try {
        const movies = await Movie.find({});

        res.render("reviews/index.ejs", { movies });

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});
router.post("/:movieId", isSignedIn, async (req, res) => {
    try {
        const { comment, rating } = req.body;

        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.send("Movie not found");
        }

        const ratingNumber = Number(rating);

        if (ratingNumber < 1 || ratingNumber > 5) {
            return res.send("Invalid rating");
        }

        await Review.create({
            comment: comment.trim(),
            rating: Number(rating),
            user: req.session.user._id,
            movie: movie._id
        });

        res.redirect(`/reviews/${movie._id}`);

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});

router.get("/:movieId", isSignedIn, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.send("Movie not found");
        }

        const reviews = await Review.find({
            movie: movie._id
        }).populate("user", "username");

        res.render("reviews/show.ejs", {
            movie,
            reviews
        });

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});

router.put("/:reviewId", isSignedIn, async (req, res) => {
    try {
        const { comment, rating } = req.body;

        const review = await Review.findOne({
            _id: req.params.reviewId,
            user: req.session.user._id
        });

        if (!review) {
            return res.json({
                message: "Review not found"
            });
        }

        if (typeof comment !== "string") {
            return res.json({ message: "Invalid review" });
        }

        if (comment.trim() === "") {
            return res.json({ message: "Invalid review" });
        }

        if (!["1", "2", "3", "4", "5"].includes(String(rating))) {
            return res.json({ message: "Invalid review" });
        }

        review.comment = comment.trim();
        review.rating = Number(rating);

        await review.save();

        res.json({
            message: "Review Updated!"
        });

    } catch (error) {
        console.log(error);

        res.json({
            message: "Something went wrong"
        });
    }
});

router.delete("/:reviewId", isSignedIn, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.reviewId,
            user: req.session.user._id
        });

        if (!review) {
            return res.json({
                message: "Review not found"
            });
        }

        res.json({
            message: "Review Deleted!"
        });

    } catch (error) {
        console.log(error);

        res.json({
            message: "Something went wrong"
        });
    }
});

module.exports = router;