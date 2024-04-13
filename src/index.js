document.addEventListener("DOMContentLoaded", () => {
     const poster = document.getElementById("poster")
     const title = document.getElementById("title")
     const showtime = document.getElementById("showtime")
     const runtime = document.getElementById("runtime")
     const description = document.getElementById("film-info")
     const remainingTickets = document.getElementById("ticket-num")
    const baseURL = "https://code-challenge-json-server.onrender.com";

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


    // Function to populate film list
const populateFilmList = async () => {
    try {
        const films = await fetchAllMovies();
        console.log(films)
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";
        films.forEach(film => {
            const li = document.createElement("li");
            li.classList.add("film-item");
            li.innerHTML = `${film.title} <button id="D${film.id}">DELETE</button>`
            li.id = film.id; 
            filmsList.appendChild(li);
            displayMovies(film)
            deleteMovie(film)
        });
    } catch (error) {
        console.error("Error populating film list:", error);
    }
};

    // Function to initialize the app
    const init = async () => {
        
        const firstMovie = await fetchMovieDetails(1);
        const films = await fetchAllMovies();
        populateFilmList(films);
    };
    
    // Call init function to initialize the app
    init();

    // Event delegation to handle movie title clicks
    document.getElementById("films").addEventListener("click", async (event) => {
        if (event.target.classList.contains("film-item")) {
            const movieId = event.target.dataset.id;
            const movie = await fetchMovieDetails(movieId);
            updateMovieDetails(movie);
        }
    });

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
    function displayMovies(movie){
        const movieSelected = document.getElementById(movie.id)
        movieSelected.addEventListener("click", () => {
        poster.src = movie.poster
        title.textContent = movie.title
        showtime.textContent = movie.showtime
        runtime.textContent = `${movie.runtime} Minutes`
        description.textContent = movie.description
        remainingTickets.textContent = `${movie.capacity - movie.tickets_sold}`
        })
    }
    function deleteMovie(movie){
        const deleteButton = document.getElementById(`D${movie.id}`)
        deleteButton.addEventListener("click", () => {
         fetch(`${baseURL}/films/${movie.id}`, {
            method : "DELETE"
         }).then(()=>document.getElementById(movie.id).remove())
        })
    }
});
