const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const Movie = require("../models/Movies.js");

router.get("/", async (req, res) => {
  const movies = await Movie.find({});

  res.render("movies/index.ejs", { movies: movies });
});

router.post("/", isSignedIn, async (req, res) => {
  console.log(req.session.user);
  req.body.owner = req.session.user._id;
  req.body.isPublic = req.body.isPublic === "on";
  await Movie.create(req.body);
  res.redirect("/");
});

router.get("/:movieId", async (req, res) => {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
        return res.send("Movie not found");
    }
    if (movie.showtimes && movie.showtimes.length > 0) {
        const savedMovie = await Movie.collection.findOne(
            { _id: movie._id }
        );
        if (savedMovie.showtimes.some(showtime => !showtime._id)) {
            movie.markModified("showtimes");
            await movie.save();
        }
    }
    res.render("movies/show.ejs", { movie: movie });
});

module.exports = router;