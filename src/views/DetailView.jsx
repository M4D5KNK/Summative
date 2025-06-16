import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css";

function DetailMovieView() {
    const [trailers, setTrailers] = useState([]);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                setLoading(true);
                const [movieResponse, videosResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`),
                    axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${import.meta.env.VITE_TMDB_KEY}`)
                ]);
                setMovie(movieResponse.data);
                setTrailers(videosResponse.data.results.filter(video => video.type === "Trailer"));
            } catch (err) {
                setError(err);
                console.error("Error fetching movie details:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMovieDetails();
    }, [id]);

    if (loading) return <div className="movie-detail-container">Loading movie details...</div>;
    if (error) return <div className="movie-detail-container">Error loading movie details</div>;
    if (!movie) return <div className="movie-detail-container">No movie data found</div>;

    return (
        <div className="movie-detail-container">
            <div className="genres-sidebar">
                <h3>GENRES</h3>
                <div className="genres-list">
                    {movie.genres?.map(genre => (
                        <div key={genre.id} className="genre-item">{genre.name}</div>
                    ))}
                </div>
            </div>

            <div className="movie-content-area">
                <div className="movie-header">
                    {movie.poster_path && (
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                    )}
                    <div className="movie-title-section">                        
                        <div className="movie-meta-grid">
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Release Date: </span>
                                <span>{movie.release_date}</span>
                            </div>
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Runtime: </span>
                                <span>{movie.runtime} minutes</span>
                            </div>
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Language: </span>
                                <span>{movie.original_language?.toUpperCase()}</span>
                            </div>
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Rating: </span>
                                <span>{movie.vote_average?.toFixed(1)}</span>
                            </div>
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Popularity: </span>
                                <span>{movie.popularity?.toFixed(1)}</span>
                            </div>
                            <div className="movie-meta-item">
                                <span className="movie-meta-label">Box Office: </span>
                                <span>${movie.revenue?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trailers-section">
                    <h2>Trailers</h2>
                    <div className="trailers-grid">
                        {trailers.map(trailer => (
                            <div key={trailer.id} className="trailer-card">
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        className="trailer-thumbnail"
                                        src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                                        alt={trailer.name}
                                    />
                                    <div className="trailer-info">
                                        <h3>{trailer.name}</h3>
                                        <p>Click to watch on YouTube</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailMovieView;