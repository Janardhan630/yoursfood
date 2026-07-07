import React from 'react'
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFoodsByFilter } from '../../api/foodApi';
import { COLLECTIONS, REGION_CARDS } from '../../api/data/discovery';
import FoodCard from '../../components/ui/FoodCard';
import RegionCard from '../regions/RegionCard';
import SearchBar from '../search/SearchBar';
import { CheckCircleIcon, LeafIcon, ArrowRightIcon } from '../../components/ui/Icons';

const DEFAULT_FILTER = COLLECTIONS.find((c) => c.id === 'popular-dishes').filter;
const DEFAULT_FILTER_META = { title: 'Popular Dishes', subtitle: 'Most-ordered across all of Andhra' };

const VISIBLE_LIMIT = 8;

// "Tiffins" is the regional term for breakfast/light-meal items — maps to
// the existing 'Breakfast' category rather than inventing a new one.
const QUICK_BROWSE_CATEGORIES = [
  { label: 'Biryani', emoji: '🍛', category: 'Biryani' },
  { label: 'Tiffins', emoji: '🍳', category: 'Breakfast' },
  { label: 'Chicken', emoji: '🍗', category: 'Chicken' },
  { label: 'Mutton', emoji: '🍖', category: 'Mutton' },
];

export default function Home({ favourites, onToggleFavourite, cart, onAddToCart, onOrderNow, onIncrementCartItem, onDecrementCartItem }) {
  const [meals, setMeals] = useState([]);
  const [filter, setFilter] = useState({ ...DEFAULT_FILTER, ...DEFAULT_FILTER_META });
  const [alertMsg, setAlertMsg] = useState('');
  const [homeSearch, setHomeSearch] = useState('');
  const discoveryRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  const preferredCategories = useMemo(
    () => [...new Set((favourites || []).map((f) => f.category))],
    [favourites]
  );

  useEffect(() => {
    let cancelled = false;
    getFoodsByFilter({ type: filter.type, value: filter.value }, { preferredCategories }).then((foods) => {
      if (!cancelled) setMeals(foods);
    });
    return () => { cancelled = true; };
    // preferredCategories deliberately excluded — only the active filter
    // (type/value) should trigger a re-fetch, not every favourites change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.type, filter.value]);

  const showAlert = (text) => {
    setAlertMsg(text);
    setTimeout(() => setAlertMsg(''), 1000);
  };

  const isFavourite = (meal) => (favourites || []).some(f => f.id === meal.id);
  const quantityInCart = (meal) => (cart || []).find(c => c.id === meal.id)?.quantity || 0;

  const toggleFavourite = (meal) => {
    const wasFavourite = isFavourite(meal);
    if (onToggleFavourite) {
      onToggleFavourite(meal);
      showAlert(wasFavourite ? `${meal.name} removed from favourites` : `${meal.name} added to favourites`);
    }
  };

  const addToCart = (meal) => {
    if (onAddToCart) {
      onAddToCart(meal);
      showAlert(`${meal.name} added to cart`);
    }
  };

  const orderNow = (meal) => {
    if (onOrderNow) onOrderNow(meal);
  };

  const scrollToMenu = () => {
    discoveryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submitHomeSearch = (e) => {
    e.preventDefault();
    const q = homeSearch.trim();
    navigate(q ? `/menu?search=${encodeURIComponent(q)}` : '/menu');
  };

  // Reuses the same category filter Menu.jsx already understands (the
  // exact ?type=category&value= shape used elsewhere for category links).
  const goToCategoryMenu = (category) => {
    navigate(`/menu?type=category&value=${encodeURIComponent(category)}`);
  };

  const openFullMenu = () => navigate('/menu');

  const selectFilter = (nextFilter) => {
    setFilter(nextFilter);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectRegion = (region) => selectFilter({
    type: 'region',
    value: region.name,
    title: `${region.name} Specials`,
    subtitle: region.tagline,
  });

  const isActiveRegion = (region) => filter.type === 'region' && filter.value === region.name;

  const goToFullMenu = () => {
    const params = new URLSearchParams({ type: filter.type });
    if (filter.value) params.set('value', filter.value);
    navigate(`/menu?${params.toString()}`);
  };

  const featuredMeal = meals[0];
  const visibleMeals = meals.slice(0, VISIBLE_LIMIT);

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
            <button type="button" className="btn btn--add" onClick={scrollToMenu}>
              Explore Menu
            </button>
            <button type="button" className="btn btn--order" onClick={() => navigate('/cart')}>
              Order Now
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
        <div className="quick-browse">
          <SearchBar
            value={homeSearch}
            onChange={setHomeSearch}
            onSubmit={submitHomeSearch}
            placeholder="Search..."
          />

          {QUICK_BROWSE_CATEGORIES.map((item) => (
            <button
              key={item.category}
              type="button"
              className="quick-browse__pill"
              onClick={() => goToCategoryMenu(item.category)}
            >
              {item.emoji} {item.label}
            </button>
          ))}

          <button
            type="button"
            className="quick-browse__pill quick-browse__pill--browse-all"
            onClick={openFullMenu}
          >
            Browse All <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div ref={discoveryRef} className="discovery-section">
        <div className="discovery-section__header">
          <h2 className="discovery-section__title">Explore by Region</h2>
          <p className="discovery-section__subtitle">Andhra Pradesh's cuisine changes character every hundred kilometres</p>
        </div>
        <div className="region-grid">
          {REGION_CARDS.map((region) => (
            <RegionCard
              key={region.name}
              name={region.name}
              emoji={region.emoji}
              tagline={region.tagline}
              isActive={isActiveRegion(region)}
              onSelect={() => selectRegion(region)}
            />
          ))}
        </div>
      </div>

      <div ref={resultsRef} className="discovery-section">
        <div className="discovery-section__header">
          <h2 className="discovery-section__title">{filter.title}</h2>
          <p className="discovery-section__subtitle">{filter.subtitle}</p>
        </div>

        {alertMsg && (
          <div className="toast">
            <CheckCircleIcon /> {alertMsg}
          </div>
        )}

        <div className="food-list">
          {visibleMeals.map(meal => (
            <FoodCard
              key={meal.id}
              meal={meal}
              isFavourite={isFavourite(meal)}
              onToggleFavourite={toggleFavourite}
              onAddToCart={addToCart}
              onOrderNow={orderNow}
              quantity={quantityInCart(meal)}
              onIncrement={onIncrementCartItem}
              onDecrement={onDecrementCartItem}
            />
          ))}
        </div>

        {meals.length > 0 && (
          <div className="discovery-section__see-all">
            <button type="button" className="btn btn--outline" onClick={goToFullMenu}>
              See All ({meals.length})
            </button>
          </div>
        )}
      </div>
    </>
  )
}
