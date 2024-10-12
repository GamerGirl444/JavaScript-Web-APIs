const apiKey = 'a990c0c0'; //api key 
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const favoritesList = document.getElementById('favoritesList');

searchButton.addEventListener('click', searchMovies);

function searchMovies() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
            .then(response => response.json())
            .then(data => {
                if (data.Search) {
                    displaySearchResults(data.Search);
                } else {
                    searchResults.innerHTML = '<p>No results found.</p>';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                searchResults.innerHTML = '<p>An error occurred. Please try again.</p>';
            });
    }
}

function displaySearchResults(movies) {
    searchResults.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <img src="${movie.Poster}" alt="${movie.Title} Poster">
            <button onclick="saveToFavorites('${movie.imdbID}')">Save to Favorites</button>
        `;
        searchResults.appendChild(movieCard);
    });
}

function saveToFavorites(imdbID) {
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
        .then(response => response.json())
        .then(movie => {
            const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
                favorites.push(movie);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                displayFavorites();
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach(movie => {
        const favoriteCard = document.createElement('div');
        favoriteCard.classList.add('movie-card', 'favorite-card');
        favoriteCard.innerHTML = `
            <h3>${movie.Title}</h3>
            <p>Year: ${movie.Year}</p>
            <img src="${movie.Poster}" alt="${movie.Title} Poster">
            <button onclick="removeFromFavorites('${movie.imdbID}')">Remove</button>
        `;
        favoritesList.appendChild(favoriteCard);
    });
}

function removeFromFavorites(imdbID) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Display favorite
displayFavorites();