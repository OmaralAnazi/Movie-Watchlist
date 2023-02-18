const myKey = "c8277e76"
const searchInput = document.getElementById("search-input")
const moviesElement = document.getElementById("movies")
const notificationElement = document.getElementById("notification-message")

let userWatchlist = getMoviesFromLocalStorage()

document.addEventListener("click", e => {
    const elementId = e.target.id 
    
    if (parseInt(elementId) || elementId.startsWith("0")) {
        const movieIndex = parseInt(elementId)
        const imdbId = userWatchlist[movieIndex].imdbID
        removeMovieFromLocalStorage(imdbId)
        renderWatchlist()
    }
})

function removeMovieFromLocalStorage(imdbId) {
    userWatchlist = userWatchlist.filter( movie => movie.imdbID !== imdbId )
    localStorage.setItem('moviesWatchList', JSON.stringify(userWatchlist))
    runRemoveAnimation()
}

function getMoviesFromLocalStorage() {
    if(localStorage.getItem("moviesWatchList")) 
        return JSON.parse(localStorage.getItem('moviesWatchList')) 
    return []
}

function renderWatchlist() {
    if(userWatchlist.length !== 0) {
        moviesElement.innerHTML = ""

        userWatchlist.forEach( (movie, index) => {
            fetch(`http://www.omdbapi.com/?apikey=${myKey}&i=${movie.imdbID}`)
                .then(response => response.json())
                .then(movieObject => {
                    moviesElement.innerHTML += getMovieHtml(movieObject, index)
                })
        })
    }
    else {
        moviesElement.innerHTML = `
            <div class="initial-main-state">
                <h2 class="initial-text-bigger"> Your watchlist is looking a little empty... </h2>
                <a href="index.html" class="add-film-btn bigger-btn"> <img class="icon" src="images/plus-icon.png" alt="plus icon"> Let's add some movies! </a>
            </div>
        `
    }
}

function getMovieHtml(movie, index) {
    return `
    <section class="film">
        <img class="film-img" src="${movie.Poster}" alt="show poster of ${movie.Title}">
        <div class="flex-container-column">
            <div class="flex-container">
                <h2 class="film-name">${movie.Title}</h2>
                <p class="film-rate"> <img class="icon" src="images/star-icon.png" alt="star icon"> ${movie.imdbRating}</p>
            </div>
            <div class="flex-container">
                <p class="film-time">${movie.Runtime}</p>
                <p class="film-categories">${movie.Genre}</p>
                <button id="${index}" class="add-film-btn"> <img class="icon" src="images/minus-icon.png" alt="minus icon"> Remove </button>
            </div>
            <p class="film-description">${movie.Plot}</p>
        </div>
    </section>
    <hr>`
}

function runRemoveAnimation() {
    if(notificationElement.style.display !== "flex") {
        document.getElementById("notification-message").style.display = "flex"
        setTimeout(() => {
            document.getElementById("notification-message").style.display = "none" 
        }, 5000)
    }
}

renderWatchlist()