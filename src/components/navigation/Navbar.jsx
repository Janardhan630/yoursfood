import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from '../../features/theme/ThemeToggle'
import { CartIcon, LeafIcon, MenuIcon, CloseIcon } from '../ui/Icons'
import profile from '../../assets/images/profile.jpg'

const LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/myorders', label: 'My Orders' },
  { to: '/favourites', label: 'Favourites' },
  { to: '/contact', label: 'Contact Us' },
]

export default function Navbar({ authUser, cartCount }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (path) => {
    setMobileOpen(false)
    navigate(path)
  }

  const NavLinks = () => (
    <>
      {LINKS.map((link) => (
        <a
          key={link.to}
          href={link.to}
          className={`navbar__link ${location.pathname === link.to ? 'is-active' : ''}`}
          onClick={(e) => { e.preventDefault(); go(link.to) }}
        >
          {link.label}
        </a>
      ))}
    </>
  )

  return (
    <>
      <div className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <a
          href="/home"
          className="navbar__logo"
          onClick={(e) => { e.preventDefault(); go('/home') }}
        >
          <span className="navbar__logo-mark"><LeafIcon /></span>
          Food Delivery
        </a>

        <div className="navbar__links">
          <NavLinks />
        </div>

        <div className="navbar__actions">
          {authUser ? (
            <a
              href="/profile"
              className="navbar__user-link"
              onClick={(e) => { e.preventDefault(); go('/profile') }}
            >
              {authUser.name}
            </a>
          ) : (
            <a
              href="/useracc"
              className="navbar__user-link"
              onClick={(e) => { e.preventDefault(); go('/useracc') }}
            >
              New User
            </a>
          )}

          <ThemeToggle />

          <button
            type="button"
            className="icon-btn navbar__cart"
            onClick={() => go('/cart')}
            aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
          >
            <CartIcon />
            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
          </button>

          <img
            className="navbar__avatar"
            src={profile}
            alt="profile"
            onClick={() => go(authUser ? '/profile' : '/useracc')}
            style={{ cursor: 'pointer' }}
          />

          <button
            type="button"
            className="icon-btn navbar__hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile-panel">
          <NavLinks />
        </div>
      )}
    </>
  )
}
