import './SearchView.css'
import axios from 'axios';
import { useState, useEffect, useCallback } from "react";
import { useStoreContext } from '../context/context';
import { Link } from "react-router-dom";


function SearchView() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const { cart, setCart } = useStoreContext();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    const fetchSearchResults = useCallback(async () => {
        if (!debouncedQuery.trim()) {
            setMovies([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/movie`,
                {
                    params: {
                        api_key: import.meta.env.VITE_TMDB_KEY,
                        query: debouncedQuery,
                        page: page
                    }
                }
            );
            setMovies(response.data.results);
        } catch (error) {
            console.error("Error searching movies:", error);
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, page]);

    useEffect(() => {
        fetchSearchResults();
    }, [fetchSearchResults]);


    const cartAdd = (movie) => {
        if (cart.has(movie.id)) {
            alert("This movie is already in your cart.");
        } else {
            setCart(prevCart => prevCart.set(movie.id, movie));
        }
    };

    return (
        <div className='search-view'>
            <h1>Search Movies</h1>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for movies..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && fetchSearchResults()}
                />
            </div>

            <div className="genre-movies-grid">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : movies.length > 0 ? (
                    movies.map((movie) => (
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
                            <button className='buy-button' onClick={() => cartAdd(movie)}>
                                {cart.has(movie.id) ? "Added" : "Buy"}
                            </button>
                        </div>
                    ))
                ) : debouncedQuery && !loading ? (
                    <p className="no-results">No movies found for your search/page</p>
                ) : null}
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
    )

}

export default SearchView;