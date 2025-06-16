import axios from "axios";
import { useEffect, useState } from "react";
import './FeaturedSection.css'

function FeaturedSection() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const randomPage = Math.floor(Math.random() * 10) + 1;
                const { data: { results } } = await axios.get(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}&page=${randomPage}`
                );
                setMovies(results.slice(0, 3));
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        })();
    }, []);

    return (
        <div className="featured-movies-display">
            {movies.map(movie => (
                <div className="movie-card" key={movie.id}>
                    <img 
                        src={movie.poster_path 
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                            : 'https://via.placeholder.com/500x750?text=No+Poster'
                        } 
                        alt={movie.title} 
                    />
                    <h3>{movie.title}</h3>
                    <p>Rating: {movie.vote_average?.toFixed(1)}</p>
                </div>
            ))}
        </div>
    )
}

export default FeaturedSection;