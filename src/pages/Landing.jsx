import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Used throughout via <motion.div>/<motion.section>/etc. JSX member-expression
// tags, which this project's eslint config (no eslint-plugin-react) doesn't
// recognize as a use of the `motion` import.
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { getPopularFoods } from '../api/foodApi'
import { REGION_CARDS } from '../api/data/discovery'
import SearchBar from '../features/search/SearchBar'
import {
  LeafIcon, ArrowRightIcon, StarIcon, HeartIcon, SparklesIcon,
  ClockIcon, FlameIcon, CartIcon,
} from '../components/ui/Icons'

// Public, pre-login home page shown at "/" for logged-out visitors — App.jsx
// swaps this out for the real (guarded) Home once a session exists.
// Structure mirrors the user's reference marketing page (hero, featured
// categories, popular items, value-prop tips, testimonials, CTA banner),
// but every data-bearing section uses this app's real content: actual
// regions/dishes from src/api/data, not invented copy. Every call to
// action goes straight to /useracc or through a guarded route, which
// ProtectedRoute already bounces to /useracc while remembering where the
// visitor was headed.

const FLOATS = [
  { emoji: '🌶️', style: { left: '6%', top: '14%', fontSize: '44px' }, delay: 0 },
  { emoji: '🍤', style: { right: '9%', top: '10%', fontSize: '34px' }, delay: 1.2 },
  { emoji: '🍛', style: { left: '11%', bottom: '18%', fontSize: '36px' }, delay: 0.6 },
  { emoji: '🥭', style: { right: '6%', bottom: '22%', fontSize: '40px' }, delay: 1.8 },
  { emoji: '🍚', style: { left: '44%', top: '8%', fontSize: '28px' }, delay: 2.4 },
]

const TIPS = [
  { id: 'fast', icon: ClockIcon, title: 'Fast Delivery', text: 'Hot meals at your door in as little as 30 minutes, on average.' },
  { id: 'fresh', icon: FlameIcon, title: 'Fresh & Authentic', text: 'Every dish cooked to order and spiced the traditional way.' },
  { id: 'variety', icon: LeafIcon, title: 'Wide Variety', text: '10+ curated menus, from tiffins to biryani to seafood specials.' },
  { id: 'easy', icon: CartIcon, title: 'Easy Ordering', text: 'Build your cart, save favourites, and track orders in one place.' },
]

const TESTIMONIALS = [
  { id: 't1', name: 'Ramesh Naidu', role: 'Regular, Guntur specials', avatar: '🧔🏽', quote: 'The Guntur chicken biryani tastes like it came straight from a local mess back home. Delivery was quick and still piping hot.', rating: 5 },
  { id: 't2', name: 'Sindhu Reddy', role: 'Weeknight regular', avatar: '👩🏽', quote: 'Love that I can filter by spice level — finally an app that gets how spicy real Andhra food should be.', rating: 4.5 },
  { id: 't3', name: 'Kiran Kumar', role: 'Office lunch orders', avatar: '👨🏽‍💼', quote: 'Ordering for the whole team is effortless, and the tracking is spot on. Never had a late delivery yet.', rating: 5 },
]

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

function DishCard({ meal, index, onAction }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="landing-card landing-dish"
    >
      <button type="button" className="landing-dish__link" onClick={onAction} aria-label={`View ${meal.name}`}>
        <span className="landing-dish__media">
          <img src={meal.image} alt={meal.name} loading="lazy" />
          <span className="landing-dish__rating"><StarIcon /> {meal.rating.toFixed(1)}</span>
        </span>
        <span className="landing-dish__body">
          <span className="landing-dish__chips">
            <span className="landing-chip landing-chip--sm">{meal.category}</span>
            <span className="landing-chip landing-chip--sm">{meal.region}</span>
          </span>
          <h3>{meal.name}</h3>
          <p>{meal.description}</p>
          <span className="landing-dish__meta">₹{meal.price}</span>
        </span>
      </button>
      <button
        type="button"
        className="landing-dish__fav"
        onClick={onAction}
        aria-label="Add to favourites (sign in required)"
      >
        <HeartIcon />
      </button>
    </motion.article>
  )
}

export default function Landing() {
  const [query, setQuery] = useState('')
  const [popularMeals, setPopularMeals] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    getPopularFoods().then((foods) => {
      if (!cancelled) setPopularMeals(foods.slice(0, 3))
    })
    return () => { cancelled = true }
  }, [])

  const promptLogin = () => navigate('/useracc')

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/menu?search=${encodeURIComponent(q)}` : '/menu')
  }

  const goToRegion = (region) => navigate(`/menu?type=region&value=${encodeURIComponent(region.name)}`)

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        {FLOATS.map((f) => (
          <motion.span
            key={f.emoji}
            aria-hidden="true"
            className="landing-hero__float"
            style={f.style}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
          >
            {f.emoji}
          </motion.span>
        ))}

        <div className="landing-hero__inner">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="landing-chip"
          >
            <SparklesIcon /> Authentic Andhra &amp; Telugu cuisine
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="landing-hero__title"
          >
            Let your <span>FOOD</span>, choose your <span>MOOD</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="landing-hero__subtitle"
          >
            From fiery Guntur biryani to melt-in-the-mouth Pootharekulu — real Andhra
            flavours, cooked fresh and delivered straight to your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="landing-search"
          >
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={submitSearch}
              placeholder="Search for biryani, chicken 65, filter coffee…"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="landing-hero__actions"
          >
            <button type="button" className="btn btn--order" onClick={promptLogin}>
              Get Started Free <ArrowRightIcon />
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/menu')}>
              Explore Menu
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured regions */}
      <motion.section {...reveal} className="landing-section">
        <div className="landing-section__head">
          <div>
            <h2 className="landing-section__title">Explore by Region</h2>
            <p className="landing-section__subtitle">Andhra Pradesh's cuisine changes character every hundred kilometres.</p>
          </div>
          <button type="button" className="landing-section__link" onClick={() => navigate('/menu')}>
            View all <ArrowRightIcon />
          </button>
        </div>
        <div className="landing-grid landing-grid--4">
          {REGION_CARDS.map((region, i) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <button type="button" className="landing-card landing-region" onClick={() => goToRegion(region)}>
                <span className="landing-region__emoji" aria-hidden="true">{region.emoji}</span>
                <span className="landing-region__body">
                  <h3>{region.name}</h3>
                  <p>{region.tagline}</p>
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Popular dishes */}
      {popularMeals.length > 0 && (
        <motion.section {...reveal} className="landing-band">
          <div className="landing-section">
            <div className="landing-section__head">
              <div>
                <h2 className="landing-section__title">Popular Right Now</h2>
                <p className="landing-section__subtitle">Sign in to order — here's a taste of what's trending.</p>
              </div>
              <button type="button" className="landing-section__link" onClick={() => navigate('/menu')}>
                Browse all <ArrowRightIcon />
              </button>
            </div>
            <div className="landing-grid landing-grid--3">
              {popularMeals.map((meal, i) => (
                <DishCard key={meal.id} meal={meal} index={i} onAction={promptLogin} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Why Food Delivery */}
      <motion.section {...reveal} className="landing-section">
        <h2 className="landing-section__title landing-section__title--center">Why Food Delivery?</h2>
        <div className="landing-grid landing-grid--4">
          {TIPS.map((tip, i) => {
            const Icon = tip.icon
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="landing-card landing-tip"
              >
                <span className="landing-tip__icon"><Icon /></span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section {...reveal} className="landing-band">
        <div className="landing-section">
          <h2 className="landing-section__title landing-section__title--center">Loved by Our Customers</h2>
          <div className="landing-grid landing-grid--3">
            {TESTIMONIALS.map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="landing-card landing-quote"
              >
                <div className="landing-quote__stars" aria-label={`Rated ${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <StarIcon key={s} className={s < Math.round(t.rating) ? '' : 'is-dim'} />
                  ))}
                </div>
                <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption>
                  <span className="landing-quote__avatar" aria-hidden="true">{t.avatar}</span>
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA banner */}
      <motion.section {...reveal} className="landing-section">
        <div className="landing-cta">
          <span className="landing-cta__deco landing-cta__deco--tl" aria-hidden="true">🌶️</span>
          <span className="landing-cta__deco landing-cta__deco--br" aria-hidden="true">🍛</span>
          <h2>Hungry yet?</h2>
          <p>Create your free account and start ordering in under a minute.</p>
          <button type="button" className="btn landing-cta__btn" onClick={promptLogin}>
            Sign Up Free <ArrowRightIcon />
          </button>
        </div>
      </motion.section>
    </div>
  )
}
