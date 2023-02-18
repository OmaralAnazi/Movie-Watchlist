const myKey = "c8277e76"
const searchInput = document.getElementById("search-input")
const moviesElement = document.getElementById("movies")
const notificationElement = document.getElementById("notification-message")
let currentViewedMovies = null
let userWatchlist = getMoviesFromLocalStorage()

document.addEventListener("click", e => {
    const elementId = e.target.id 
    
    if(elementId === "search-btn")
        fetchMovies()
    
    else if (parseInt(elementId) || elementId.startsWith("0")) {
        const movieIndex = parseInt(elementId)
        const imdbId = currentViewedMovies[movieIndex].imdbID
        console.log(currentViewedMovies[movieIndex])
        saveMovieToLocalStorage(imdbId)
        runAddAnimation(isUnsavedMovie(imdbId))
    }

})

function getMoviesFromLocalStorage() {
    if(localStorage.getItem("moviesWatchList")) 
        return JSON.parse(localStorage.getItem('moviesWatchList')) 
    return []
}

function saveMovieToLocalStorage(imdbId) {
    if(isUnsavedMovie(imdbId)) {
        fetch(`http://www.omdbapi.com/?apikey=${myKey}&i=${imdbId}`)
            .then(response => response.json())
            .then(movieObject => {
                
                    userWatchlist.push(movieObject)
                    localStorage.setItem('moviesWatchList', JSON.stringify(userWatchlist))
                
            })
    }
}

function isUnsavedMovie(imdbId) {
    return userWatchlist.filter( movie => movie.imdbID === imdbId).length === 0
}

function fetchMovies() {
    const title = searchInput.value

    fetch(`http://www.omdbapi.com/?apikey=${myKey}&s=${title}`)
        .then(response => {
            if(!response.ok)
                throw Exception("something went wrong")
            return response.json()
        })
        .then(movies => {
            renderMovies(movies)
            currentViewedMovies = movies.Search
        })
        .catch(err => {
            moviesElement.innerHTML = `
                <div class="initial-main-state">
                    <p class="initial-text-bigger"> Unable to find what you're looking for. Please try another search. </p>
                </div>
            `
        })
}

function renderMovies(movies) {
    moviesElement.innerHTML = ""

    movies.Search.forEach((movie, index) => {
        fetch(`http://www.omdbapi.com/?apikey=${myKey}&i=${movie.imdbID}`)
            .then(response => {
                if(!response.ok)
                    throw Exception("something went wrong")
                return response.json()
            })
            .then(movieObject => {
                moviesElement.innerHTML += getMovieHtml(movieObject, index)
            })
    })
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
                <button id="${index}" class="add-film-btn"> <img class="icon" src="images/plus-icon.png" alt="plus icon"> Watchlist</button>
            </div>
            <p class="film-description">${movie.Plot}</p>
        </div>
    </section>
    <hr>`
}

function runAddAnimation(successfulAdding) {
    notificationElement.innerHTML = successfulAdding? `<img class="icon" src="images/checked-icon.png" alt="checked icon"> Show is added!`
                                    :`<img class="icon" src="images/incorrect-icon.png" alt="incorrect icon"> Show is already added!`
    
    if(notificationElement.style.display !== "flex") {
        document.getElementById("notification-message").style.display = "flex"
        setTimeout(() => {
            document.getElementById("notification-message").style.display = "none" 
        }, 5000)
    }
}