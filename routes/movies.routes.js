const router = require("express").Router();
const isSignedIn = require("../middleware/is-signed-in.js");
const Movie = require("../models/Movies.js");

router.get("/new", isSignedIn, (req, res) => {
  res.render("movies/new.ejs");
});

router.get("/", async (req, res) => {
  const movies = await Movie.find();

  res.render("movies/index.ejs", { movies: movies });
});

router.post("/", isSignedIn, async (req, res) => {
  console.log(req.session.user);

  req.body.owner = req.session.user._id;

  req.body.isPublic = req.body.isPublic === "on";

  await Movie.create(req.body);

  res.redirect("/");
});

router.get("/my-movies", isSignedIn, async (req, res) => {
  const movies = await Movie.find({
    owner: req.session.user._id
  });

  res.render("movies/my-movies.ejs", { movies });
});


module.exports = router;