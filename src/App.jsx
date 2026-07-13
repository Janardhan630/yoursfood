import React from 'react'
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from 'react'
import Home from './features/home/Home'
import Menu from './features/menu/Menu'
import Favourites from './features/favourites/Favourites'
import Myorders from './features/orders/Myorders'
import Cart from './features/cart/Cart'
import Contact from './pages/Contact'
import Landing from './pages/Landing'
import Profile from './features/profile/Profile'
import Useracc from './features/auth/useracc'
import Navbar from './components/navigation/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './routes/ProtectedRoute'
import ThemeToggle from './features/theme/ThemeToggle'
import { CheckCircleIcon, ArrowLeftIcon } from './components/ui/Icons'

function Layout({
  authUser,
  cart,
  favourites,
  handleToggleFavourite,
  handleRemoveFromFavourites,
  handleAddToCart,
  handleOrderNow,
  handleRemoveFromCart,
  handleIncrementCartItem,
  handleDecrementCartItem,
  setAuthUser,
  authReady,
  authToast,
  clearAuthToast,
  handleLoginSuccess,
}) {
  const guard = (element) => (
    <ProtectedRoute authUser={authUser} authReady={authReady}>
      {element}
    </ProtectedRoute>
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on every route change so the fade/slide-up page-enter
  // animation starts from a consistent position instead of wherever the
  // previous page happened to be scrolled to.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [location.pathname]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAuthPage = location.pathname === '/useracc';

  return (
    <div className='body'>
      {isAuthPage ? (
        <>
          <button
            type="button"
            className="auth-back-home"
            onClick={() => navigate('/')}
          >
            <ArrowLeftIcon /> Home
          </button>
          <div className="auth-topbar">
            <ThemeToggle />
          </div>
        </>
      ) : (
        <Navbar authUser={authUser} cartCount={cartCount} />
      )}

      {authToast && (
        <div
          className="toast toast--auth"
          role="status"
          aria-live="polite"
          onAnimationEnd={clearAuthToast}
        >
          <CheckCircleIcon />
          <span>{authToast}</span>
        </div>
      )}

      <div key={location.pathname} className="page-transition">
        <Routes>
          {/* Root: public marketing landing before login; the real Home once
              authenticated. /home stays guarded, same as every other route. */}
          <Route
            path='/'
            element={
              !authReady ? null : authUser ? (
                <Home
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                  onAddToCart={handleAddToCart}
                  onOrderNow={handleOrderNow}
                  onIncrementCartItem={handleIncrementCartItem}
                  onDecrementCartItem={handleDecrementCartItem}
                  cart={cart}
                />
              ) : (
                <Landing />
              )
            }
          />

          <Route
            path='/home'
            element={guard(
              <Home
                favourites={favourites}
                onToggleFavourite={handleToggleFavourite}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onIncrementCartItem={handleIncrementCartItem}
                onDecrementCartItem={handleDecrementCartItem}
                cart={cart}
              />
            )}
          />

          <Route
            path='/menu'
            element={guard(
              <Menu
                favourites={favourites}
                onToggleFavourite={handleToggleFavourite}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onIncrementCartItem={handleIncrementCartItem}
                onDecrementCartItem={handleDecrementCartItem}
                cart={cart}
              />
            )}
          />

          <Route
            path='/favourites'
            element={guard(
              <Favourites
                favourites={favourites}
                onRemoveFromFavourites={handleRemoveFromFavourites}
                onAddToCart={handleAddToCart}
                onOrderNow={handleOrderNow}
                onIncrementCartItem={handleIncrementCartItem}
                onDecrementCartItem={handleDecrementCartItem}
                cart={cart}
              />
            )}
          />

          <Route
            path='/myorders'
            element={guard(<Myorders />)}
          />

          <Route
            path='/cart'
            element={guard(
              <Cart
                cart={cart}
                onRemoveFromCart={handleRemoveFromCart}
                onIncrementCartItem={handleIncrementCartItem}
                onDecrementCartItem={handleDecrementCartItem}
              />
            )}
          />

          <Route
            path='/contact'
            element={guard(<Contact />)}
          />

          <Route
            path='/profile'
            element={guard(<Profile setAuthUser={setAuthUser} />)}
          />
          <Route
            path='/useracc'
            element={<Useracc onAuth={(u) => setAuthUser(u)} onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </div>
  );
}

// Must match the key any other tab/session reading the cart would use.
const CART_STORAGE_KEY = 'cart';

function getStoredCart() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export default function App() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getStoredCart);
  const [favourites, setFavourites] = useState([]);
  const [authUser, setAuthUser] = useState(null)//
  const [authReady, setAuthReady] = useState(false);
  const [authToast, setAuthToast] = useState('');

  const handleLoginSuccess = () => {
    setAuthToast('Welcome back! 👋 Login successful.');
  };

  const handleToggleFavourite = (meal) => {
    setFavourites((prev) => {
      if (prev.some(f => f.id === meal.id)) {
        return prev.filter(f => f.id !== meal.id);
      }
      return [...prev, meal];
    });
  };

  const handleRemoveFromFavourites = (meal) => {
    setFavourites((prev) => prev.filter(f => f.id !== meal.id));
  };

  // Adds one unit; increments quantity instead of no-op'ing if it's
  // already in the cart. Deliberately does not navigate — Add to Cart is
  // called from Home, Menu, and Favourites, and the user should stay on
  // whichever page they were browsing (unlike Order Now, which does jump
  // to checkout).
  const handleAddToCart = (meal) => {
    setCart((prev) => {
      if (prev.some(c => c.id === meal.id)) {
        return prev.map(c => c.id === meal.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
  };

  // Order Now / Buy Now: add/increment the item then jump straight to
  // checkout, instead of Add to Cart's stay-on-menu behaviour.
  const handleOrderNow = (meal) => {
    setCart((prev) => {
      if (prev.some(c => c.id === meal.id)) {
        return prev.map(c => c.id === meal.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
    navigate('/cart');
  };

  const handleRemoveFromCart = (meal) => {
    setCart((prev) => prev.filter(c => c.id !== meal.id));
  };

  const handleIncrementCartItem = (meal) => {
    setCart((prev) => prev.map(c => c.id === meal.id ? { ...c, quantity: c.quantity + 1 } : c));
  };

  // Quantity reaching zero removes the item from the cart entirely.
  const handleDecrementCartItem = (meal) => {
    setCart((prev) => prev
      .map(c => c.id === meal.id ? { ...c, quantity: c.quantity - 1 } : c)
      .filter(c => c.quantity > 0));
  };

  //new user
  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setAuthUser(JSON.parse(u));
    } catch (e) { }
    setAuthReady(true);
  }, []);

  // Persist the cart across refreshes using the same localStorage
  // mechanism already used for the user session/addresses.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) { /* ignore write failures (e.g. private mode) */ }
  }, [cart]);

  return (
    <Layout
      authUser={authUser}
      cart={cart}
      favourites={favourites}
      handleToggleFavourite={handleToggleFavourite}
      handleRemoveFromFavourites={handleRemoveFromFavourites}
      handleAddToCart={handleAddToCart}
      handleOrderNow={handleOrderNow}
      handleRemoveFromCart={handleRemoveFromCart}
      handleIncrementCartItem={handleIncrementCartItem}
      handleDecrementCartItem={handleDecrementCartItem}
      setAuthUser={setAuthUser}
      authReady={authReady}
      authToast={authToast}
      clearAuthToast={() => setAuthToast('')}
      handleLoginSuccess={handleLoginSuccess}
    />
  );
}
