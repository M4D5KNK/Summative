import './HeaderSection.css'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../context/context';
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import React, { useState, useEffect } from 'react';

function HeaderSection() {
    const { user, setUser } = useStoreContext();
    const [firstName, setFirstName] = useState("");
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            navigate('/');
        } catch (error) {
            alert('Error logging out!');
        }
    };

    useEffect(() => {
        if (user) {
            if (user.displayName) {
                setFirstName(user.displayName.split(' ')[0]);
            }
        }
    });

    return (
        <div className="navbar">
            <div className="navbar-container">
                <div className="logo-container">
                    <h1>Name</h1>
                </div>
                <div className="nav-links">
                     <a className="nav-link"><Link to={`/`} className="nav-link">Home</Link></a>
                            <a className="nav-link"><Link to={`/movies`} className="nav-link">Movies</Link></a>
                            <a className="nav-link"><Link to={`/movies/search`} className="nav-link">Search</Link></a>
                </div>
                <div className="welcome-container">
                    {user ? (
                        <> <p className="welcome-message">Welcome, {firstName}!</p> </>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="button-container">
                    {user ? (
                        <>
                            <button className="buttons" type="button"><Link to={`/cart`} className="button">Cart</Link></button>
                            <button className="buttons" type="button"><Link to={`/settings`} className="button">Settings</Link></button>
                            <button className="buttons" type="button" onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="buttons" type="button"><Link to={`/login`} className="button">Login</Link></button>
                            <button className="buttons" type="button"><Link to={`/register`} className="button">Register</Link></button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HeaderSection;