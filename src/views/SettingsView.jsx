import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";
import { firestore } from "../firebase";
import { useStoreContext } from "../context/context";
import { Link } from 'react-router-dom';
import HeaderSection from './components/HeaderSection.jsx';
import FooterSection from './components/FooterSection.jsx';
import "./SettingsView.css";

function SettingsView() {
    const { user } = useStoreContext();
    const [firstName, setFirstName] = useState(user.displayName.split(' ')[0]);
    const [lastName, setLastName] = useState(user.displayName.split(' ')[1]);
    const [newFirstName, setNewFirstName] = useState(user.displayName.split(' ')[0]);
    const [newLastName, setNewLastName] = useState(user.displayName.split(' ')[1]);
    const [isEditingFirstName, setIsEditingFirstName] = useState(false);
    const [isEditingLastName, setIsEditingLastName] = useState(false);
    const { selectedGenres, setSelectedGenres } = useStoreContext();
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isPasswordSectionExpanded, setIsPasswordSectionExpanded] = useState(false);
    const [previousPurchases, setPreviousPurchases] = useState([]);
  const [page, setPage] = useState(1);
    const itemsPerPage = 8;
    const isGoogleUser = user.providerData.some(profile => profile.providerId === 'google.com');

    const genresList = [
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

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSelectedGenres(userData.selectedGenres || []);
                    setPreviousPurchases(userData.previousPurchases || []);
                }
            }
        };

        fetchUserData();
    }, [user, firestore, setSelectedGenres]);

    const handleFirstNameChange = (e) => {
        setNewFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setNewLastName(e.target.value);
    };

    const handleGenreChange = (genre) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.some((g) => g.id === genre.id)
                ? prevGenres.filter((g) => g.id !== genre.id)
                : [...prevGenres, genre]
        );
    };

    const handlePasswordChange = async () => {
        setIsPasswordSectionExpanded(true);
    };

    const handleCancelPasswordChange = () => {
        setIsPasswordSectionExpanded(false);
        setCurrentPassword("");
        setNewPassword("");
    };

    const handleUpdatePassword = async () => {
        if (user && currentPassword) {
            try {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
            } catch (error) {
                alert("Your current password is incorrect!");
                return;
            }
        } else {
            alert("Please enter your current password!");
            return;
        }

        if (!newPassword) {
            alert("Please enter a new password!");
            return;
        }

        if (newPassword.length < 6) {
            alert("New password should be at least 6 characters!");
            return;
        }

        if (currentPassword === newPassword) {
            alert("New password should be different from the current password!");
            return;
        }

        try {
            await updatePassword(user, newPassword);
            alert("Saved!");
            setIsPasswordSectionExpanded(false);
            setCurrentPassword("");
            setNewPassword("");
        } catch (error) {
            alert("Failed to update password.");
        }
    };

    const handleSaveFirstName = async () => {
        if (user) {
            await updateProfile(user, { displayName: `${newFirstName} ${lastName}` });
            setFirstName(newFirstName);
            setIsEditingFirstName(false);
            alert(`Saved first name, ${newFirstName}!`);
        }
    };

    const handleSaveLastName = async () => {
        if (user) {
            await updateProfile(user, { displayName: `${firstName} ${newLastName}` });
            setLastName(newLastName);
            setIsEditingLastName(false);
            alert(`Saved last name, ${newLastName}!`);
        }
    };

    const handleSaveGenres = async () => {
        if (user) {
            try {
                await updateDoc(doc(firestore, "users", user.uid), {
                    selectedGenres
                });
                alert("Saved!");
            } catch (error) {
                alert("Failed to update favorite genres.");
            }
        }
    };

    const handleCancelFirstNameChange = () => {
        setNewFirstName(firstName);
        setIsEditingFirstName(false);
    };

    const handleCancelLastNameChange = () => {
        setNewLastName(lastName);
        setIsEditingLastName(false);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = previousPurchases.slice(startIndex, endIndex);

    return (
        <div className="settings-container">
            <HeaderSection />
            <div className="settings-content">
                <h1 className="settings-title">Account Settings</h1>
                <div className="settings-card">


                    <div className="settings-field">

                        <label className="settings-label">First Name</label>


                        <label className="settings-info-value">
                            {isGoogleUser ? (
                                <span>{firstName}</span>
                            ) : (
                                isEditingFirstName ? (
                                    <input type="text" value={newFirstName} onChange={handleFirstNameChange} />
                                ) : (
                                    <span>{firstName}</span>
                                )
                            )}
                        </label>
                        {!isGoogleUser && (
                            <>
                                {!isEditingFirstName && (
                                    <button className="edit-button" onClick={() => setIsEditingFirstName(true)}>Edit</button>
                                )}
                                {isEditingFirstName && (
                                    <>
                                        <div className="edit-buttons">
                                            <button className="edit-button" onClick={handleSaveFirstName}>Save</button>
                                            <button className="edit-button" onClick={handleCancelFirstNameChange}>Cancel</button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                    </div>

                    <div className="settings-field">
                        <label className="settings-label">Last Name</label>
                        <label className="settings-info-value">
                            {isGoogleUser ? (
                                <span>{lastName}</span>
                            ) : (
                                isEditingLastName ? (
                                    <input type="text" value={newLastName} onChange={handleLastNameChange} />
                                ) : (
                                    <span>{lastName}</span>
                                )
                            )}
                        </label>
                        {!isGoogleUser && (
                            <>
                                {!isEditingLastName && (
                                    <button className="edit-button" onClick={() => setIsEditingLastName(true)}>Edit</button>
                                )}
                                {isEditingLastName && (
                                    <>
                                        <div className="edit-buttons">
                                            <button className="edit-button" onClick={handleSaveLastName}>Save</button>
                                            <button className="edit-button" onClick={handleCancelLastNameChange}>Cancel</button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="settings-field">
                        <label className="settings-label">Email</label>
                        <span className="settings-value">{user.email}</span>
                    </div>


                    <div className='settings-field'>
                        <label className="settings-label">Password</label>
                        {!isGoogleUser && (
                            <>
                                <div className="settings-section">
                                    {isPasswordSectionExpanded ? (
                                        <>
                                            <div className="change-password-section">
                                                <div className="current-password-section">
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        placeholder="Current password"
                                                    />
                                                    <button className="edit-button" onClick={handleCancelPasswordChange}>Cancel</button>
                                                </div>
                                                <div className="new-password-section">
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder="New password"
                                                    />
                                                    <button className="edit-button" onClick={handleUpdatePassword}>Update</button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="settings-info-value">••••••••</span>
                                            <button className="edit-button" onClick={handlePasswordChange}>Change</button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="settings-field">
                        <label className="settings-label">Favorite Genres</label>
                        <div className="genre-grid">
                            {genresList.map((genre) => (
                                <label key={genre.id} className="genre-item">
                                    <input
                                        type="checkbox"
                                        id={`genre-${genre.id}`}
                                        checked={selectedGenres.some(g => g.id === genre.id)}
                                        onChange={() => handleGenreChange(genre)}
                                        className="genre-checkbox"
                                    />
                                    <span className="genre-label">{genre.genre}</span>
                                </label>
                            ))}
                        </div>
                        <button className="edit-button" onClick={handleSaveGenres}>Save</button>
                    </div>


                </div>
                <div className="previous-purchases-container">
                    <h2 className="previous-purchases-title">Previous Purchases</h2>
                    <div className="genre-movies-grid">
                        {currentItems.length > 0 ? (
                            currentItems.map((purchase) => (
                                <div key={purchase.id} className="movie-card">
                                    <Link to={`/movies/details/${purchase.id}`}>
                                        <img
                                            src={purchase.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${purchase.poster_path}`
                                                : 'https://via.placeholder.com/500x750?text=No+Poster'
                                            }
                                            alt={purchase.title}
                                        />
                                    </Link>
                                    <h3>{purchase.title}</h3>
                                    <p>Rating: {purchase.vote_average?.toFixed(1)}</p>
                                </div>
                            ))
                        ) : (
                            <p className='previous-purchases-none-message'>No previous purchases found.</p>
                        )}
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


            </div>

            <FooterSection />
        </div>
    );
}

export default SettingsView;