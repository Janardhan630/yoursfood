import React from 'react'
import FoodCard from '../../components/ui/FoodCard'
import { CartIcon } from '../../components/ui/Icons'

export default function Cart({ cart, onRemoveFromCart, onIncrementCartItem, onDecrementCartItem }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const gst = totalCost * 0.18;
  const service = totalCost * 0.05;
  const janardhanCharge = totalCost * 0.02;

  const handlePlaceOrder = () => {
    alert('Order placed successfully! Thank you for ordering with us.');
  };

  return (
    <div className="page-section">
      <div className="page-section__header">
        <h2>Your Cart</h2>
        {cart.length > 0 && <span className="page-section__count">{totalItems} item{totalItems === 1 ? '' : 's'}</span>}
      </div>

      {(cart || []).length === 0 ? (
        <div className="empty-state">
          <CartIcon />
          <h3>Your cart is empty</h3>
          <p>Add something delicious from the menu to get started.</p>
        </div>
      ) : (
        <>
          <div className="food-list">
            {cart.map(item => (
              <FoodCard
                key={item.id}
                meal={item}
                onRemove={onRemoveFromCart}
                removeLabel="Remove"
                quantity={item.quantity}
                onIncrement={onIncrementCartItem}
                onDecrement={onDecrementCartItem}
              />
            ))}
          </div>

          <div className="summary-card">
            <div className="summary-card__row"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="summary-card__row"><span>Service Charge (5%)</span><span>₹{service.toFixed(2)}</span></div>
            <div className="summary-card__row"><span>Janardhan Charge (2%)</span><span>₹{janardhanCharge.toFixed(2)}</span></div>
            <div className="summary-card__row summary-card__row--total"><span>Total</span><span>₹{totalCost}</span></div>
            <button type="button" className="btn btn--order btn--block" onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  )
}
