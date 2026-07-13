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

export function CartIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="9" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="21" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  );
}

export function HeartIcon({ className, filled }) {
  return (
    <svg {...shared} className={className} fill={filled ? 'currentColor' : 'none'}>
      <path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.6 4A5 5 0 0 1 12 7a5 5 0 0 1 6.4-3c3.3.5 5.1 3.8 3.6 7.2-2.5 4.7-10 9.3-10 9.3Z" />
    </svg>
  );
}

export function StarIcon({ className }) {
  return (
    <svg {...shared} className={className} fill="currentColor" stroke="none">
      <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z" />
    </svg>
  );
}

export function TrashIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 7h16M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7m-9 0 .8 12.2c0 .9.8 1.6 1.7 1.6h6c.9 0 1.7-.7 1.7-1.6L19 7" />
    </svg>
  );
}

export function MenuIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
    </svg>
  );
}

export function CloseIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function UserIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.3-3.7 4.3-5.6 7.5-5.6s6.2 1.9 7.5 5.6" />
    </svg>
  );
}

export function CheckCircleIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.3 12.3 2.5 2.5 5-5.2" />
    </svg>
  );
}

export function LeafIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M5 19c8 0 13-5 13-13V4h-2C8 4 5 9 5 17v2Z" />
      <path d="M5 19c3-3 6-6 13-13" />
    </svg>
  );
}

export function ArrowRightIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export function SearchIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20.5 20.5-4.3-4.3" />
    </svg>
  );
}

export function PlusIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function FilterIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function ClockIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function FlameIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

export function UserPlusIcon({ className }) {
  return (
    <svg {...shared} className={className}>
      <circle cx="9" cy="8" r="3.6" />
      <path d="M2.5 20c1.2-3.5 3.9-5.3 6.5-5.3s5.3 1.8 6.5 5.3" />
      <path d="M18.5 8.5v5M16 11h5" />
    </svg>
  );
}
