import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderSection from "./components/HeaderSection";
import Genres from "./components/Genres";
import FooterSection from "./components/FooterSection";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase";
import "./MoviesView.css";

function MoviesView() {
const [selectedGenres, setSelectedGenres] = useState([]);
    const user = auth.currentUser;

    useEffect(() => {
        const fetchSelectedGenres = async () => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSelectedGenres(userData.selectedGenres || []);
                }
            }
        };

        fetchSelectedGenres();
    }, [user, firestore]);


    const genres = [
        { genre: "Action", id: 28 },
        { genre: "Adventure", id: 12 },
        { genre: "Animation", id: 16 },
        { genre: "Crime", id: 80 },
        { genre: "Family", id: 10751 },
        { genre: "History", id: 36 },
        { genre: "Fantasy", id: 14 },
        { genre: "Horror", id: 27 },
        { genre: "Sci-Fi", id: 878 },
        { genre: "Mystery", id: 9648 },
    ];

    return (
        <div className="app-container">
            <HeaderSection />
            <div className="genre-container">
                <div className="genre-list">
                    <Genres genresList={selectedGenres} />
                </div>
                <div className="genre-movies">
                    <Outlet />
                </div>
            </div>
            <FooterSection />
        </div>

    );
}

export default MoviesView;