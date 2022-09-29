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

// Gets movies stored in localStorage and maps over them.
let movies = Object.keys(localStorage);
movies.flatMap(async (movie) => {
    mainSection.innerHTML = ''
    const res = await fetch(`https://www.omdbapi.com/?apikey=2b35c99d&t=${movie}`)
    let data = await res.json()
    
    mainSection.innerHTML += movieListHtml(data)
})

// removes movies from localStorage and reloads the page
function removeFromFavorites(data) {
    localStorage.removeItem(data, data);
    location.reload()
};

// HTML for each movie returned in the map
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
                <p id="movie-card-info-sub-watchlist"><button type="submit" class="remove-icon" onclick="removeFromFavorites('${data.Title}')">-</button>
                <span style="font-weight: 400;">Remove</span></p>
            </div>
            <div id="movie-card-info-desc">
                <p id="movie-card-info-desc-text">${data.Plot}</p>
            </div>
        </div>
    </div>
    <hr>`
    
    return movieCard
}