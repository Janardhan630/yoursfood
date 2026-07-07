import React from 'react'
import { useNavigate } from 'react-router-dom'
import FoodCard from '../../components/ui/FoodCard'
import { HeartIcon } from '../../components/ui/Icons'

export default function Favourites({ favourites, onRemoveFromFavourites, onAddToCart, onOrderNow, cart, onIncrementCartItem, onDecrementCartItem }) {
  const navigate = useNavigate();
  const totalCost = favourites.reduce((sum, fav) => sum + fav.price, 0);
  const quantityInCart = (meal) => (cart || []).find(c => c.id === meal.id)?.quantity || 0;

  const gst = totalCost * 0.18;
  const service = totalCost * 0.05;
  const janardhanCharge = totalCost * 0.02;

  return (
    <div className="page-section">
      <div className="page-section__header">
        <h2>Your Favourites</h2>
        {favourites.length > 0 && <span className="page-section__count">{favourites.length} item{favourites.length === 1 ? '' : 's'}</span>}
      </div>

      {(favourites || []).length === 0 ? (
        <div className="empty-state">
          <HeartIcon />
          <h3>No favourites yet</h3>
          <p>Tap the heart on any dish to save it here.</p>
        </div>
      ) : (
        <>
          <div className="food-list">
            {favourites.map(fav => (
              <FoodCard
                key={fav.id}
                meal={fav}
                isFavourite
                onToggleFavourite={onRemoveFromFavourites}
                onAddToCart={onAddToCart}
                onOrderNow={onOrderNow}
                quantity={quantityInCart(fav)}
                onIncrement={onIncrementCartItem}
                onDecrement={onDecrementCartItem}
              />
            ))}
          </div>

          <div className="summary-card">
            <div className="summary-card__row"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="summary-card__row"><span>Service Charge (5%)</span><span>₹{service.toFixed(2)}</span></div>
            <div className="summary-card__row"><span>Janardhan Charge (2%)</span><span>₹{janardhanCharge.toFixed(2)}</span></div>
            <div className="summary-card__row summary-card__row--total"><span>Total</span><span>₹{(totalCost * 1.25).toFixed(2)}</span></div>
            <button type="button" className="btn btn--order btn--block" onClick={() => navigate('/cart')}>Checkout</button>
          </div>
        </>
      )}
    </div>
  )
}
