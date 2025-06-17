import './LoginRegisterView.css'
import FooterSection from './components/FooterSection.jsx'
import HeaderSection from './components/HeaderSection.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { useStoreContext } from '../context/context.jsx';
import { useState, useRef } from 'react';


function RegisterView() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { setUser } = useStoreContext();
    const navigate = useNavigate();
    const checkBoxesRef = useRef({});

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

    function displayError(error) {
        if (error.message === "Firebase: Error (auth/email-already-in-use).") {
            alert("This email is already in use!");
        } else if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
            alert("Password should be at least 6 characters!");
        } else {
            alert("Error creating user with email!");
        }
    }

    const registerWithEmail = async (event) => {
        event.preventDefault();

        try {
            if (confirmPassword != password) {
                showToast("Your passwords don't match!");
                return;
            }

            const selectedGenresIds = Object.keys(checkBoxesRef.current)
                .filter((genreId) => checkBoxesRef.current[genreId].checked)
                .map(Number);

            const selectedGenres = genres.filter((genre) => selectedGenresIds.includes(genre.id));
            if (selectedGenresIds.length < 5) {
                showToast("You need at least 5 genres!");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: `${firstName} ${lastName}` });

            await setDoc(doc(firestore, "users", user.uid), {
                selectedGenres,
                previousPurchases: []
            });

            setUser(user);
            navigate('/movies');
        } catch (error) {
            displayError(error);
        }
    };

    const registerWithGoogle = async () => {
        try {
            const selectedGenresIds = Object.keys(checkBoxesRef.current)
                .filter((genreId) => checkBoxesRef.current[genreId].checked)
                .map(Number);

            if (selectedGenresIds.length < 5) {
                alert("You need at least 5 genres!");
                return;
            }

            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            const selectedGenres = genres.filter((genre) => selectedGenresIds.includes(genre.id));

            await setDoc(doc(firestore, "users", user.uid), {
                selectedGenres,
                previousPurchases: []
            });

            setUser(user);
            navigate('/movies');
            showToast("Registered successfully using Google!");
        } catch (error) {
            showToast("Error creating user with Google!");
        }
    }

    return (
        <div>
            <HeaderSection />
            <form onSubmit={(e) => registerWithEmail(e)}>
                <div className='log-reg-container'>
                    <div className="log-reg-box">
                        <h4>Register!</h4>
                        <div className="field">
                            <svg className="input-icon" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                            <input 
                            autoComplete="off" 
                            id="firstname" 
                            placeholder="First Name" 
                            className="input-field"
                            name="logemail" 
                            type="text" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)} 
                            required />
                        </div>

                        <div className="field">
                            <svg className="input-icon" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                            </svg>
                            <input 
                            autoComplete="off" 
                            id="lastname" 
                            placeholder="Last Name" 
                            className="input-field"    
                            name="logemail" 
                            type="text" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} 
                            required />
                        </div>

                        <div className="field">
                            <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z">
                                </path>
                            </svg>
                            <input 
                            autoComplete="off" 
                            id="logemail" 
                            placeholder="Email" 
                            className="input-field"
                            nameName="logemail" 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            required />
                        </div>

                        <div className="field">
                            <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z">
                                </path>
                            </svg>
                            <input 
                            autoComplete="off" 
                            placeholder="Password" 
                            className="input-field" 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            required />
                        </div>

                        <div className="field">
                            <svg className="input-icon" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z">
                                </path>
                            </svg>
                            <input 
                            autoComplete="off" 
                            placeholder="Confirm Password" 
                            className="input-field" 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required />
                        </div>

                        <button className="btn" type="submit">Register</button>
                        <button className="btn" onClick={() => registerWithGoogle()}>Register with Google</button>
                        <a className="btn-link">Already Have An Account? <Link to={'/login'}>Login</Link></a>


                        <div className="genre-selector">
                            <h3>Choose Your Favorite Genres</h3>
                            <div className="genre-grid">
                                {genres.map((item) => {
                                    return (
                                        <div key={item.id} className="genre-item">
                                            <input
                                                type="checkbox"
                                                id={`genre-${item.id}`}
                                                ref={(el) => (checkBoxesRef.current[item.id] = el)}
                                            />
                                            <label htmlFor={`genre-${item.id}`}>{item.genre}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>


                    </div>
                </div>
            </form>
            <FooterSection />
        </div>
    )
}

export default RegisterView;

