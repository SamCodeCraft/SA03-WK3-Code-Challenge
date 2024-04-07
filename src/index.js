// Function to fetch film data from the server and display the details of the first movie
async function fetchAndDisplayFirstMovie() {
    try {
        const response = await fetch('/films/1');
        const movieData = await response.json();

        // Calculate the number of available tickets
        const availableTickets = movieData.capacity - movieData.tickets_sold;

        // Display movie details on the page
        document.getElementById('title').innerText = movieData.title;
        document.getElementById('runtime').innerText = `${movieData.runtime} minutes`;
        document.getElementById('showtime').innerText = movieData.showtime;
        document.getElementById('ticket-num').innerText = `${availableTickets} remaining tickets`;
        document.getElementById('film-info').innerText = movieData.description;
        document.getElementById('poster').src = movieData.poster;
        document.getElementById('buy-ticket').addEventListener('click', async () => {
            await buyTicket(movieData.id);
        });
    } catch (error) {
        console.error('Error fetching and displaying movie:', error);
    }
}

// Function to fetch all movies and display them in the films menu
async function fetchAndDisplayAllMovies() {
    try {
        const response = await fetch('/films');
        const moviesData = await response.json();

        // Remove the placeholder li element
        const filmsList = document.getElementById('films');
        filmsList.innerHTML = '';

        // Loop through each movie data and create li elements for them
        moviesData.forEach(movie => {
            const li = document.createElement('li');
            li.className = 'film item';
            li.innerText = movie.title;

            // Add click event listener to each film item to display its details
            li.addEventListener('click', async () => {
                await fetchAndDisplayMovieDetails(movie.id);
            });

            // Append the li element to the films list
            filmsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching and displaying movies:', error);
    }
}

// Function to fetch and display movie details when a film item is clicked
async function fetchAndDisplayMovieDetails(movieId) {
    try {
        const response = await fetch(`/films/${movieId}`);
        const movieData = await response.json();

        // Calculate the number of available tickets
        const availableTickets = movieData.capacity - movieData.tickets_sold;

        // Display movie details on the page
        document.getElementById('title').innerText = movieData.title;
        document.getElementById('runtime').innerText = `${movieData.runtime} minutes`;
        document.getElementById('showtime').innerText = movieData.showtime;
        document.getElementById('ticket-num').innerText = `${availableTickets} remaining tickets`;
        document.getElementById('film-info').innerText = movieData.description;
        document.getElementById('poster').src = movieData.poster;
        document.getElementById('buy-ticket').addEventListener('click', async () => {
            await buyTicket(movieData.id);
        });
    } catch (error) {
        console.error('Error fetching and displaying movie details:', error);
    }
}

// Function to handle buying tickets for a movie
async function buyTicket(movieId) {
    try {
        const response = await fetch(`/films/${movieId}`);
        const movieData = await response.json();

        // Check if tickets are available
        if (movieData.tickets_sold < movieData.capacity) {
            // Update the tickets_sold count on the server
            const updatedTicketsSold = movieData.tickets_sold + 1;
            await fetch(`/films/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: updatedTicketsSold
                })
            });

            // Update the frontend to reflect the purchased ticket
            const availableTickets = movieData.capacity - updatedTicketsSold;
            document.getElementById('ticket-num').innerText = `${availableTickets} remaining tickets`;

            // Check if the movie is sold out
            if (availableTickets === 0) {
                // Change the button text to "Sold Out"
                document.getElementById('buy-ticket').innerText = 'Sold Out';
            }
        } else {
            console.log('Movie is sold out.');
        }
    } catch (error) {
        console.error('Error buying ticket:', error);
    }
}

// Function to initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Display the first movie's details
    await fetchAndDisplayFirstMovie();

    // Display all movies in the films menu
    await fetchAndDisplayAllMovies();
});



































































