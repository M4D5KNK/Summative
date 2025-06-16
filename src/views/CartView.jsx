import { useStoreContext } from '../context/context.jsx';
import { Link } from 'react-router-dom';
import HeaderSection from './components/HeaderSection.jsx';
import "./CartView.css";
import FooterSection from './components/FooterSection.jsx';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useState } from 'react';

function CartView() {
    const { cart, setCart, user } = useStoreContext(); // Changed to currentUser
    const [checkoutMessage, setCheckoutMessage] = useState('');

const handleCheckout = async () => {
        try {
            if (!user) {
                alert('Please login to checkout');
                return;
            }

            const userRef = doc(firestore, "users", user.uid);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();

            // Get current cart items as array
            const purchasedItems = Array.from(cart.values());

            // Update Firestore with new purchases
            await updateDoc(userRef, {
                previousPurchases: [...(userData.previousPurchases || []), ...purchasedItems]
            });

            // Clear cart and local storage
            setCart(cart.clear());
            localStorage.removeItem(user.uid);

            // Show success message
            setCheckoutMessage('Thank you for your purchase! Enjoy your movies!');

        } catch (error) {
            console.error("Error during checkout:", error);
            alert('There was an error processing your checkout');
        }
    };
    
    return (
        <div>
            <HeaderSection />
            <div className="cart-view">
                <h1 className="cart-title">Shopping Cart</h1>
                {checkoutMessage ? (
                    <div className="checkout-success">
                        <p>{checkoutMessage}</p>
                        <Link to="/movies" className="browse-button">Continue Shopping</Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cart.size === 0 ? (
                                <div className="cart-empty">
                                    <p>Your cart is empty</p>
                                    <Link to="/movies" className="browse-button">Browse Movies</Link>
                                </div>
                            ) : (
                                cart.entrySeq().map(([key, value]) => (
                                    <div className="movie-card" key={key}>
                                        <img src={`https://image.tmdb.org/t/p/w500${value.poster_path}`} alt={value.title} />
                                        <h3>{value.title}</h3>
                                        <p>Rating: {value.vote_average?.toFixed(1)}</p>
                                        <button className='buy-button' onClick={() => setCart(prevCart => prevCart.delete(key))}>Remove</button>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.size > 0 && (
                            <div className="checkout-section">
                                <button className="checkout-button" onClick={handleCheckout}>
                                    Checkout
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <FooterSection />
        </div>
    );
}

export default CartView;