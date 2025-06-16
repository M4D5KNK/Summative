import { Link } from 'react-router-dom';
import "./Genres.css";

function Genres(props) {
    return (
        <div>
            <h3 className='genres-title'>GENRES</h3>
            <ul>
                {props.genresList.map((item) => {
                    return (
                        <li key={item.id}>
                            <Link to={`/movies/genre/${item.id}`}>
                                <button>{item.genre}</button>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Genres;