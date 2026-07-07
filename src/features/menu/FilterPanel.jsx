import React from 'react'
import { CATEGORIES, REGIONS } from '../../api/data/andhraFoods'

const RATING_OPTIONS = [
  { value: '', label: 'Any rating' },
  { value: '3', label: '3.0 & up' },
  { value: '3.5', label: '3.5 & up' },
  { value: '4', label: '4.0 & up' },
  { value: '4.5', label: '4.5 & up' },
];

const SPICE_OPTIONS = [
  { value: 1, label: 'Mild' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Hot' },
];

export default function FilterPanel({ filters, onChange, onReset, hasActiveFilters }) {
  const { category, region, veg, minPrice, maxPrice, minRating, spiceLevels, availableOnly } = filters;

  const toggleSpice = (level) => {
    const next = spiceLevels.includes(level)
      ? spiceLevels.filter((l) => l !== level)
      : [...spiceLevels, level];
    onChange({ spiceLevels: next });
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel__group">
        <span className="filter-panel__label">Veg / Non-Veg</span>
        <div className="filter-chips">
          <button type="button" className={`filter-chip ${veg === null ? 'is-active' : ''}`} onClick={() => onChange({ veg: null })}>Any</button>
          <button type="button" className={`filter-chip ${veg === true ? 'is-active' : ''}`} onClick={() => onChange({ veg: true })}>Veg</button>
          <button type="button" className={`filter-chip ${veg === false ? 'is-active' : ''}`} onClick={() => onChange({ veg: false })}>Non-Veg</button>
        </div>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label" htmlFor="filter-category">Category</label>
        <select
          id="filter-category"
          className="field-input"
          value={category || ''}
          onChange={(e) => onChange({ category: e.target.value || null })}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label" htmlFor="filter-region">Region</label>
        <select
          id="filter-region"
          className="field-input"
          value={region || ''}
          onChange={(e) => onChange({ region: e.target.value || null })}
        >
          <option value="">All regions</option>
          {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div className="filter-panel__group">
        <span className="filter-panel__label">Price Range (₹)</span>
        <div className="filter-panel__range">
          <input
            type="number"
            className="field-input"
            placeholder="Min"
            min="0"
            value={minPrice ?? ''}
            onChange={(e) => onChange({ minPrice: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label="Minimum price"
          />
          <span className="filter-panel__range-sep">–</span>
          <input
            type="number"
            className="field-input"
            placeholder="Max"
            min="0"
            value={maxPrice ?? ''}
            onChange={(e) => onChange({ maxPrice: e.target.value === '' ? null : Number(e.target.value) })}
            aria-label="Maximum price"
          />
        </div>
      </div>

      <div className="filter-panel__group">
        <label className="filter-panel__label" htmlFor="filter-rating">Rating</label>
        <select
          id="filter-rating"
          className="field-input"
          value={minRating ?? ''}
          onChange={(e) => onChange({ minRating: e.target.value === '' ? null : Number(e.target.value) })}
        >
          {RATING_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="filter-panel__group">
        <span className="filter-panel__label">Spice Level</span>
        <div className="filter-chips">
          {SPICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`filter-chip ${spiceLevels.includes(opt.value) ? 'is-active' : ''}`}
              onClick={() => toggleSpice(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel__group">
        <span className="filter-panel__label">Availability</span>
        <div className="filter-chips">
          <button
            type="button"
            className={`filter-chip ${availableOnly ? 'is-active' : ''}`}
            onClick={() => onChange({ availableOnly: !availableOnly })}
          >
            Available Now
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <button type="button" className="btn btn--ghost filter-panel__reset" onClick={onReset}>
          Clear all filters
        </button>
      )}
    </div>
  )
}
