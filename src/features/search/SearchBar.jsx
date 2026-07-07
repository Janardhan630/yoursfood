import React from 'react'
import { SearchIcon, CloseIcon } from '../../components/ui/Icons'

// Renders as a <form> (Enter, or clicking the search icon, submits) when
// `onSubmit` is passed — e.g. Home's search, which navigates to /menu on
// submit — or as a plain <div> for live/instant filtering when it's
// omitted, e.g. the Menu page's own search, which filters as you type
// with no submit step (its icon stays purely decorative).
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search dishes, categories, regions, ingredients…',
  autoFocus = false,
  variant,
}) {
  const className = `search-bar${variant ? ` search-bar--${variant}` : ''}`

  const icon = onSubmit ? (
    <button type="submit" className="search-bar__icon-btn" aria-label="Search">
      <SearchIcon />
    </button>
  ) : (
    <SearchIcon className="search-bar__icon" />
  )

  const fields = (
    <>
      {icon}
      <input
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search dishes"
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <CloseIcon />
        </button>
      )}
    </>
  )

  if (onSubmit) {
    return (
      <form className={className} onSubmit={onSubmit} role="search">
        {fields}
      </form>
    )
  }

  return <div className={className}>{fields}</div>
}
