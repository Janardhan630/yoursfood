import React from 'react'

export default function RegionCard({ name, emoji, tagline, isActive, onSelect }) {
  return (
    <button
      type="button"
      className={`region-card ${isActive ? 'is-active' : ''}`}
      onClick={onSelect}
      aria-pressed={isActive}
    >
      <span className="region-card__emoji" aria-hidden="true">{emoji}</span>
      <span className="region-card__name">{name}</span>
      <span className="region-card__tagline">{tagline}</span>
    </button>
  )
}
