import React from 'react'
import { PlusIcon, MinusIcon } from './Icons'

export default function QuantityStepper({ quantity, onIncrement, onDecrement, size = 'md' }) {
  return (
    <div className={`qty-stepper ${size === 'sm' ? 'qty-stepper--sm' : ''}`}>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={onDecrement}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </button>
      <span className="qty-stepper__value" aria-live="polite">{quantity}</span>
      <button
        type="button"
        className="qty-stepper__btn"
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </button>
    </div>
  )
}
