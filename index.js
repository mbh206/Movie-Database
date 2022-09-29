const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const mainSection = document.getElementById('main-section')

// resizes the header on scroll
window.onscroll = () => {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    document.getElementById("header").style.height = "100px";
    document.getElementById("header-image").style.height = "100px";
    document.getElementById("header-title").style.fontSize = "1.5rem";
    document.getElementById("header-watchlist").style.fontSize = ".8rem";
    document.getElementById("header-desc").style.marginTop = "0px"
  } else {
    document.getElementById("header").style.height = "220px";
    document.getElementById("header-image").style.height = "220px";
    document.getElementById("header-title").style.fontSize = "3.5rem";
    document.getElementById("header-watchlist").style.fontSize = "1rem";
    document.getElementById("header-desc").style.marginTop = "40px"
  }
}

// sets the search button event to the getMovies function
searchBtn.addEventListener('click', () => { 
    getAllMovies()
})
searchInput.addEventListener("keydown", (e) => { 
    if (e.key === "Enter") 
    getAllMovies()
})

// calls the api with the search input data and returns either an error or the getMovie function
async function getAllMovies() {
    const res = await fetch(`https://www.omdbapi.com/?apikey=2b35c99d&s=${searchInput.value}`)
    let data = await res.json()

    function failedLoad(data){
        if(data.Response == "False") {
            mainSection.innerHTML = `   
                <div id="placeholder-stuff">
                    <img src="./IMG/Icon.png">
                    <h2>Oops, couldn't find anything. Try again.</h2>
                </div>`
        } else {
            getMovie(data)
        }}

    // getMovie calls the api again asking for the titles of the movies retrieved in the previous api call
    function getMovie(data) {
        mainSection.innerHTML = ''
        data.Search.flatMap(async (item) => {
            const res = await fetch(`https://www.omdbapi.com/?apikey=2b35c99d&t=${item.Title}`)
            let movie = await res.json()
            
            if(movie.Response == "False") {
                mainSection.innerHTML = `   
                    <div id="placeholder-stuff">
                        <img src="./IMG/Icon.png">
                        <h2>Oops, couldn't find anything. Try again.</h2>
                    </div>`
                } else {
                    mainSection.innerHTML += movieListHtml(movie)
                }     
            })
    }
    failedLoad(data)
}
// Adds movies to the localStorage
function addToFavorites(data) {
    localStorage.setItem(data, data);
    console.log(localStorage)
  };

// HTML for each movie mapped from the api call
function movieListHtml(data) {
    const movieCard =  `
    <div id="movie-card">
        <img src="${data.Poster}" id="movie-card-img">
        <div id="movie-card-info">
            <div id="movie-card-info-heading">
                <h3 id="movie-card-info-heading-title">${data.Title}</h3>
                <p id="movie-card-info-heading-rating">⭐ ${data.imdbRating}</p>
            </div>
            <div id="movie-card-info-sub">
                <p id="movie-card-info-sub-time">${data.Runtime}</p>
                <p id="movie-card-info-sub-cat">${data.Genre}</p>
                <p id="movie-card-info-sub-watchlist"><button type="submit" class="add-icon" onclick="addToFavorites('${data.Title}')">+</button>
                <span style="font-weight: 400;">Favorite</span></p>
            </div>
            <div id="movie-card-info-desc">
                <p id="movie-card-info-desc-text">${data.Plot}</p>
            </div>
        </div>
    </div>
    <hr>`
    return movieCard
}
