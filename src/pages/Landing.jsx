import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPopularFoods } from '../api/foodApi'
import { REGION_CARDS } from '../api/data/discovery'
import FoodCard from '../components/ui/FoodCard'
import { LeafIcon, ClockIcon, FlameIcon, CartIcon, ArrowRightIcon } from '../components/ui/Icons'

// Public, pre-login home page shown at "/" for logged-out visitors — App.jsx
// swaps this out for the real (guarded) Home once a session exists. Every
// call to action here either goes straight to /useracc or through a guarded
// route (e.g. /menu), which ProtectedRoute already bounces to /useracc while
// remembering where the visitor was headed.

const FEATURES = [
  {
    icon: ClockIcon,
    title: 'Fast Delivery',
    text: 'Hot meals at your door in as little as 30 minutes, on average.',
  },
  {
    icon: LeafIcon,
    title: 'Real Andhra Regions',
    text: `${REGION_CARDS.map((r) => r.name).join(', ')} — each region's true flavour, not a generic menu.`,
  },
  {
    icon: FlameIcon,
    title: 'Fresh & Authentic',
    text: 'Every dish cooked to order and spiced the traditional way.',
  },
  {
    icon: CartIcon,
    title: 'Easy Ordering',
    text: 'Build your cart, save favourites, and track orders in one place.',
  },
]

export default function Landing() {
  const [featuredMeal, setFeaturedMeal] = useState(null)
  const [popularMeals, setPopularMeals] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    getPopularFoods().then((foods) => {
      if (cancelled) return
      setFeaturedMeal(foods[0] ?? null)
      setPopularMeals(foods.slice(0, 4))
    })
    return () => { cancelled = true }
  }, [])

  const promptLogin = () => navigate('/useracc')

  return (
    <>
      <div className="hero">
        <div className="hero__content">
          <span className="hero__eyebrow"><LeafIcon /> Authentic Andhra &amp; Telugu cuisine</span>
          <h1 className="hero__title">
            Let your <em>FOOD</em>,<br />choose your <em>MOOD</em>.
          </h1>
          <p className="hero__subtitle">
            From fiery Guntur biryani to melt-in-the-mouth Pootharekulu — real Andhra flavours,
            cooked fresh and delivered straight to your door.
          </p>
          <div className="hero__actions">
            <button type="button" className="btn btn--order" onClick={promptLogin}>
              Get Started Free
            </button>
            <button type="button" className="btn btn--add" onClick={() => navigate('/menu')}>
              Explore Menu
            </button>
          </div>
          <div className="hero__stats">
            <div>
              <div className="hero__stat-value">30 min</div>
              <div className="hero__stat-label">Average delivery</div>
            </div>
            <div>
              <div className="hero__stat-value">10</div>
              <div className="hero__stat-label">Curated menus</div>
            </div>
            <div>
              <div className="hero__stat-value">4.8★</div>
              <div className="hero__stat-label">Customer rating</div>
            </div>
          </div>
        </div>

        {featuredMeal && (
          <div className="hero__media">
            <div className="hero__media-frame">
              <img src={featuredMeal.image} alt={featuredMeal.name} />
            </div>
            <span className="hero__badge">
              <LeafIcon /> Today's pick
            </span>
          </div>
        )}
      </div>

      <div className="discovery-section">
        <div className="discovery-section__header">
          <h2 className="discovery-section__title">Why Food Delivery?</h2>
          <p className="discovery-section__subtitle">A few reasons people keep coming back</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="feature-card">
              <span className="feature-card__icon"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {popularMeals.length > 0 && (
        <div className="discovery-section">
          <div className="discovery-section__header">
            <h2 className="discovery-section__title">Popular Right Now</h2>
            <p className="discovery-section__subtitle">Sign in to order — here's a taste of what's trending</p>
          </div>
          <div className="food-list">
            {popularMeals.map((meal) => (
              <FoodCard
                key={meal.id}
                meal={meal}
                onAddToCart={promptLogin}
                onOrderNow={promptLogin}
              />
            ))}
          </div>
          <div className="discovery-section__see-all">
            <button type="button" className="btn btn--outline" onClick={() => navigate('/menu')}>
              See Full Menu
            </button>
          </div>
        </div>
      )}

      <div className="discovery-section">
        <div className="landing-cta">
          <h2>Hungry yet?</h2>
          <p>Create your free account and start ordering in under a minute.</p>
          <button type="button" className="btn landing-cta__btn" onClick={promptLogin}>
            Sign Up Free <ArrowRightIcon />
          </button>
        </div>
      </div>
    </>
  )
}
