import React from 'react'
import { SORT_OPTIONS } from '../../api/foodApi'

export default function SortSelect({ value, onChange }) {
  return (
    <select
      className="field-input sort-select"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      aria-label="Sort dishes"
    >
      <option value="">Sort by</option>
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
