import { createContext, useState, useContext, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Map } from 'immutable';
import { auth } from "../firebase";
export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [currentGenre, setCurrentGenre] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                const sessionCart = localStorage.getItem(user.uid);
                if (sessionCart) {
                    setCart(Map(JSON.parse(sessionCart)));
                }
            }
            setLoading(false);
        });
    }, [])

    if (loading) {
        return <h1 className="loading-message">Loading...</h1>
    }

    const updateCart = (newCart) => {
        const updatedCart = typeof newCart === 'function' ? newCart(cart) : newCart;
        const immutableCart = Map.isMap(updatedCart) ? updatedCart : Map(updatedCart);
        setCart(immutableCart);
        if (user) {
            localStorage.setItem(user.uid, JSON.stringify(immutableCart.toJS()));
        }
    };

    return (
        <StoreContext.Provider value={{
            cart, setCart: updateCart,
            user, setUser,
            selectedGenres, setSelectedGenres,
            currentGenre, setCurrentGenre,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}