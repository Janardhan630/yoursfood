import React from 'react'
import { CartIcon, HeartIcon, StarIcon, TrashIcon } from './Icons'
import QuantityStepper from './QuantityStepper'

const SPICE_ICON = '🌶️';

export default function FoodCard({
  meal,
  isFavourite = false,
  onToggleFavourite,
  onAddToCart,
  onOrderNow,
  onRemove,
  removeLabel = 'Remove',
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  return (
    <div className="food-card">
      <div className="food-card__media">
        <img className="food-card__img" src={meal.image} alt={meal.name} loading="lazy" />

        <span className="badge-rating">
          <StarIcon /> {meal.rating.toFixed(1)}
        </span>

        {onToggleFavourite && (
          <button
            type="button"
            className={`icon-btn icon-btn--fav ${isFavourite ? 'is-active' : ''}`}
            onClick={() => onToggleFavourite(meal)}
            aria-pressed={isFavourite}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <HeartIcon filled={isFavourite} />
            <span className="tooltip">{isFavourite ? 'Remove favourite' : 'Add to favourites'}</span>
          </button>
        )}
      </div>

      <div className="food-card__body">
        <div className="food-card__meta">
          <span
            className={`veg-dot veg-dot--${meal.type === 'veg' ? 'veg' : 'nonveg'}`}
            role="img"
            aria-label={meal.type === 'veg' ? 'Vegetarian' : 'Non-vegetarian'}
          />
          <span className="food-card__tag">{meal.category}</span>
          <span className="spice-level" aria-label={`Spice level ${meal.spiceLevel} of 3`}>
            {SPICE_ICON.repeat(meal.spiceLevel)}
          </span>
        </div>
        <h3 className="food-card__title">{meal.name}</h3>
        <p className="food-card__desc">{meal.description}</p>
        <div className="food-card__price">₹{meal.price}</div>
      </div>

      <div className="food-card__actions">
        {quantity > 0 && onIncrement && onDecrement ? (
          <QuantityStepper
            quantity={quantity}
            onIncrement={() => onIncrement(meal)}
            onDecrement={() => onDecrement(meal)}
          />
        ) : (
          onAddToCart && (
            <button type="button" className="btn btn--add" onClick={() => onAddToCart(meal)}>
              <CartIcon /> Add
            </button>
          )
        )}
        {onOrderNow && (
          <button type="button" className="btn btn--order" onClick={() => onOrderNow(meal)}>
            Order Now
          </button>
        )}
        {onRemove && (
          <button type="button" className="btn btn--danger" onClick={() => onRemove(meal)}>
            <TrashIcon /> {removeLabel}
          </button>
        )}
      </div>
    </div>
  )
}
