import React from 'react';

// Decorative icons only — the parent control supplies its own aria-label,
// so these stay hidden from assistive tech.
const shared = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

export function SunIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7" />
    </svg>
  );
}

export function MoonIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M20.5 14.6a8.5 8.5 0 1 1-9.1-13 7 7 0 0 0 9.1 13Z" />
    </svg>
  );
}
