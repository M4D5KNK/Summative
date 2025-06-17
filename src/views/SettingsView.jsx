import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, getAuth } from "firebase/auth";
import { firestore } from "../firebase";
import { useStoreContext } from "../context/context";
import HeaderSection from '../components/HeaderSection';
import FooterSection from '../components/FooterSection';
import "./SettingsView.css";

function SettingsView() {
    const auth = getAuth();
    const { user, setUser } = useStoreContext();
    const [formData, setFormData] = useState({
        firstName: user?.displayName?.split(' ')[0] || '',
        lastName: user?.displayName?.split(' ')[1] || '',
        currentPassword: '',
        newPassword: '',
        selectedGenres: [],
        previousPurchases: [],
        page: 1
    });
    const itemsPerPage = 9;
    const isGoogleUser = user?.providerData[0]?.providerId === 'google.com';

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
        { genre: "Mystery", id: 9648 }
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(firestore, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFormData(prev => ({
                        ...prev,
                        selectedGenres: userData.selectedGenres || [],
                        previousPurchases: userData.previousPurchases || []
                    }));
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleSave = async (type) => {
        if (!user) return;

        try {
            const userRef = doc(firestore, "users", user.uid);

            switch (type) {
                case 'name':
                    await updateProfile(auth.currentUser, {
                        displayName: `${formData.firstName} ${formData.lastName}`
                    });

                    await updateDoc(userRef, {
                        firstName: formData.firstName,
                        lastName: formData.lastName
                    });

                    const updatedUser = {
                        ...auth.currentUser,
                        displayName: `${formData.firstName} ${formData.lastName}`
                    };

                    setUser(null); 
                    setTimeout(() => {
                        setUser(updatedUser);
                    }, 0);

                    alert('Name updated successfully!');
                    break;

                case 'password':
                    if (formData.currentPassword && formData.newPassword) {
                        const credential = EmailAuthProvider.credential(
                            user.email,
                            formData.currentPassword
                        );
                        await reauthenticateWithCredential(user, credential);
                        await updatePassword(user, formData.newPassword);
                        alert('Password updated successfully!');
                    }
                    break;

                case 'genres':
                    await updateDoc(doc(firestore, "users", user.uid), {
                        selectedGenres: formData.selectedGenres
                    });
                    alert('Genres updated successfully!');
                    break;
            }
        } catch (error) {
            alert('Error saving changes: ' + error.message);
        }
    };


    const startIndex = (formData.page - 1) * itemsPerPage;
    const currentItems = formData.previousPurchases.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="settings-container">
            <HeaderSection />
            <div className="settings-content">
                <h1 className="settings-title">Account Settings</h1>
                <div className="settings-card">
                    {!isGoogleUser && (
                        <>
                            <div className="settings-field">
                                <label className="settings-label">Name</label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                    className="settings-input"
                                />
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                    className="settings-input"
                                />
                                <button className="edit-button" onClick={() => handleSave('name')}>Save</button>
                            </div>

                            <div className="settings-field">
                                <label className="settings-label">Password</label>
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={formData.currentPassword}
                                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="settings-input"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="settings-input"
                                />
                                <button className="edit-button" onClick={() => handleSave('password')}>Update Password</button>
                            </div>
                        </>
                    )}

                    <div className="settings-field">
                        <label className="settings-label">Favorite Genres</label>
                        <div className="genre-grid">
                            {genresList.map(genre => (
                                <label key={genre.id} className="genre-item">
                                    <input
                                        type="checkbox"
                                        checked={formData.selectedGenres.some(g => g.id === genre.id)}
                                        onChange={() => {
                                            const newGenres = formData.selectedGenres.some(g => g.id === genre.id)
                                                ? formData.selectedGenres.filter(g => g.id !== genre.id)
                                                : [...formData.selectedGenres, genre];
                                            setFormData({ ...formData, selectedGenres: newGenres });
                                        }}
                                        className="genre-checkbox"
                                    />
                                    <span className="genre-label">{genre.genre}</span>
                                </label>
                            ))}
                        </div>
                        <button className="edit-button" onClick={() => handleSave('genres')}>Save Genres</button>
                    </div>

                    <div className="previous-purchases-container">
                        <h2>Previous Purchases</h2>
                        <div className="genre-movies-grid">
                            {currentItems.map(purchase => (
                                <div key={purchase.id} className="movie-card">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${purchase.poster_path}`}
                                        alt={purchase.title}
                                    />
                                    <h3>{purchase.title}</h3>
                                    <p>Rating: {purchase.vote_average?.toFixed(1)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="genre-view-pagination-container">
                            <button
                                className="genre-view-pagination-button"
                                onClick={() => setFormData({ ...formData, page: Math.max(formData.page - 1, 1) })}
                            >
                                Prev
                            </button>
                            <button
                                className="genre-view-pagination-button"
                                onClick={() => setFormData({ ...formData, page: formData.page + 1 })}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
}

export default SettingsView;