document.addEventListener("DOMContentLoaded", () => {
    // Base URL for API
    const baseURL = "http://localhost:3000";

    // Function to fetch movie details by ID
    const fetchMovieDetails = async (id) => {
        try {
            const response = await fetch(`${baseURL}/films/${id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch movie details");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    // Function to fetch all movies
    const fetchAllMovies = async () => {
        try {
            const response = await fetch(`${baseURL}/films`);
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    // Function to update movie details on the UI
    const updateMovieDetails = (movie) => {
        const movieDetails = document.querySelector(".movie-details");
        movieDetails.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h2>${movie.title}</h2>
            <p>Runtime: ${movie.runtime} mins</p>
            <p>Showtime: ${movie.showtime}</p>
            <p>Tickets Available: ${movie.capacity - movie.tickets_sold}</p>
            <button id="buyTicketBtn">Buy Ticket</button>
        `;
        const buyTicketBtn = document.getElementById("buyTicketBtn");
        buyTicketBtn.addEventListener("click", () => buyTicket(movie));
    };

    // Function to populate film list
    const populateFilmList = (films) => {
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";
        films.forEach(film => {
            const li = document.createElement("li");
            li.classList.add("film-item");
            li.textContent = film.title;
            li.dataset.id = film.id; // Assuming you have a data attribute "data-id" on each title with the movie ID
            filmsList.appendChild(li);
        });
    };

    // Function to fetch and update movie details
    const fetchAndUpdateMovieDetails = async (id) => {
        const movie = await fetchMovieDetails(id);
        updateMovieDetails(movie);
    };

    // Function to buy a ticket
    const buyTicket = async (movie) => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        if (availableTickets > 0) {
            const updatedTicketsSold = movie.tickets_sold + 1;
            const updatedMovie = { ...movie, tickets_sold: updatedTicketsSold };
            // Update movie details on the server
            await updateMovieOnServer(updatedMovie);
            // Update movie details on the UI
            updateMovieDetails(updatedMovie);
            // POST the new ticket to the tickets endpoint
            await postTicket(movie.id, 1);
        } else {
            alert("Sorry, this movie is sold out!");
        }
    };

    // Function to update movie details on the server
    const updateMovieOnServer = async (movie) => {
        try {
            const response = await fetch(`${baseURL}/films/${movie.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold })
            });
            if (!response.ok) {
                throw new Error("Failed to update movie details on server");
            }
        } catch (error) {
            console.error("Error updating movie details on server:", error);
        }
    };

    // Function to post a new ticket to the tickets endpoint
    const postTicket = async (filmId, numberOfTickets) => {
        try {
            const response = await fetch(`${baseURL}/tickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ film_id: filmId, number_of_tickets: numberOfTickets })
            });
            if (!response.ok) {
                throw new Error("Failed to post new ticket");
            }
        } catch (error) {
            console.error("Error posting new ticket:", error);
        }
    };

    // Function to initialize the app
    const init = async () => {
        // Fetch and update movie details for the first movie
        const firstMovie = await fetchMovieDetails(1);
        updateMovieDetails(firstMovie);
        // Fetch and populate film list
        const films = await fetchAllMovies();
        populateFilmList(films);
    };
    
    // Call init function to initialize the app
    init();

    // Attach event listener to movie titles
    const movieTitles = document.querySelectorAll(".film-item");
    movieTitles.forEach(title => {
        title.addEventListener("click", async () => {
            const movieId = title.dataset.id; // Assuming you have a data attribute "data-id" on each title with the movie ID
            const movie = await fetchMovieDetails(movieId);
            updateMovieDetails(movie);
        });
    });
});



















































































































































































































































































































