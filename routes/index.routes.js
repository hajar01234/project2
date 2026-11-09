const router = require("express").Router();
const Movies = require("../models/Movies.js");

router.get("/", async (req, res) => {
    try {
        const movies = await Movies.find();

        res.render("homepage.ejs", { movies });

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});

module.exports = router;