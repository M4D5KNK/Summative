import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStoreContext } from "../context/context";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./GenreView.css";

function GenreView() {
  const { genre_id } = useParams();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const { cart, setCart, user } = useStoreContext(); 
  const [purchasedMovies, setPurchasedMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${genre_id}&page=${page}`
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchMovies();
  }, [genre_id, page]);

  useEffect(() => {
    const fetchPurchasedMovies = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setPurchasedMovies(userData.previousPurchases || []);
          }
        } catch (error) {
          console.error("Error fetching purchased movies:", error);
        }
      }
    };

    if (user) {
      fetchPurchasedMovies();
    }
  }, [user]);

  const cartAdd = (movie) => {

 // Check if movie is already purchased
        const isAlreadyPurchased = purchasedMovies.some(pm => pm.id === movie.id);
        console.log("Movie:", movie.id, "Already purchased:", isAlreadyPurchased); // Debug log

    if (cart.has(movie.id)) {
      alert("This movie is already in your cart.");
    } if (isAlreadyPurchased) {
      alert("You've already purchased this movie!");
    } else {
      setCart(prevCart => prevCart.set(movie.id, movie));
    }
  };


  return (
    <div className="hero">
      <div className="genre-movies-grid">
        {movies.map(movie => (
          <div className="movie-card" key={movie.id}>
            <Link to={`/movies/details/${movie.id}`}>
              <img
                src={movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster'
                }
                alt={movie.title}
              />
            </Link>
            <h3>{movie.title}</h3>
            <p>Rating: {movie.vote_average?.toFixed(1)}</p>
            <button className="buy-button" onClick={() => cartAdd(movie)}>
              {cart.has(movie.id) ? "Added" : "Buy"}
            </button>
          </div>
        ))}
      </div>

      <div className="genre-view-pagination-container">
        <button
          className="genre-view-pagination-button"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>
        <button
          className="genre-view-pagination-button"
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default GenreView;