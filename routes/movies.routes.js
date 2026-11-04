const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const Movie = require("../models/Movies.js");

// New movie
router.get("/new", isSignedIn, (req, res) => {
  res.render("movies/new.ejs");
});

// All movies
router.get("/", async (req, res) => {
  const movies = await Movie.find({});

  res.render("movies/index.ejs", { movies: movies });
});

// Create movie
router.post("/", isSignedIn, async (req, res) => {
  console.log(req.session.user);

  req.body.owner = req.session.user._id;

  req.body.isPublic = req.body.isPublic === "on";

  await Movie.create(req.body);

  res.redirect("/");
});

// My movies
router.get("/my-movies", isSignedIn, async (req, res) => {
  const movies = await Movie.find({
    owner: req.session.user._id
  });

  res.render("movies/my-movies.ejs", { movies });
});

// Movie Details
router.get("/:movieId", async (req, res) => {

    const movie = await Movie.findById(req.params.movieId);

    if (!movie) {
        return res.status(404).send("Movie not found");
    }

    res.render("movies/show.ejs", { movie: movie });

});

module.exports = router;