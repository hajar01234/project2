const movies = document.querySelectorAll(".movie");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");

let currentMovie = 0;

function showMovie(index) {
    movies[currentMovie].hidden = true;
    currentMovie = index;
    movies[currentMovie].hidden = false;
}

nextBtn.addEventListener("click", () => {
    const nextMovie = (currentMovie + 1) % movies.length;
    showMovie(nextMovie);
});

prevBtn.addEventListener("click", () => {
    const previousMovie = (currentMovie - 1 + movies.length) % movies.length;
    showMovie(previousMovie);
});