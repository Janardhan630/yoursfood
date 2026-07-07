import React from 'react'
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queryFoods } from '../../api/foodApi';
import { resolveFilterMeta } from '../../api/data/discovery';
import FoodCard from '../../components/ui/FoodCard';
import SearchBar from '../search/SearchBar';
import FilterPanel from './FilterPanel';
import SortSelect from './SortSelect';
import { CheckCircleIcon, FilterIcon } from '../../components/ui/Icons';

const BASE_OPTIONS = [
  { value: 'all', label: 'All Dishes' },
  { value: 'special', label: "Today's Special" },
  { value: 'popular', label: 'Popular' },
  { value: 'topRated', label: 'Top Rated' },
  { value: 'recommended', label: 'Recommended' },
];

const EMPTY_FILTERS = {
  category: null,
  region: null,
  veg: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  spiceLevels: [],
  availableOnly: false,
};

function computeHeading(search, base, filters) {
  const trimmed = search.trim();
  if (trimmed) {
    return { title: `Search results for "${trimmed}"`, subtitle: null };
  }
  const parts = [filters.category, filters.region].filter(Boolean);
  if (parts.length) {
    return {
      title: parts.join(' · '),
      subtitle: filters.category && filters.region ? `${filters.category} dishes from ${filters.region}` : null,
    };
  }
  return resolveFilterMeta(base === 'all' ? 'popular' : base, null);
}

export default function Menu({ favourites, onToggleFavourite, onAddToCart, onOrderNow, cart, onIncrementCartItem, onDecrementCartItem }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Legacy support: Home's collection/region cards link here with
  // ?type=category&value=X (or type=region/special/popular/topRated/
  // recommended). Read once as the initial seed; afterwards this page's
  // own controls (search/filters/sort) drive state, which then normalizes
  // the URL to the richer ?search=&category=&region=&... shape below.
  const legacyType = searchParams.get('type');
  const legacyValue = searchParams.get('value');

  const [meals, setMeals] = useState([]);
  const [alertMsg, setAlertMsg] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [base, setBase] = useState(() => (
    ['special', 'popular', 'topRated', 'recommended'].includes(legacyType) ? legacyType : 'all'
  ));
  const [filters, setFilters] = useState(() => ({
    category: searchParams.get('category') || (legacyType === 'category' ? legacyValue : null),
    region: searchParams.get('region') || (legacyType === 'region' ? legacyValue : null),
    veg: searchParams.get('veg') === 'true' ? true : searchParams.get('veg') === 'false' ? false : null,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : null,
    spiceLevels: searchParams.get('spice') ? searchParams.get('spice').split(',').map(Number) : [],
    availableOnly: searchParams.get('available') === 'true',
  }));
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || null);

  const preferredCategories = useMemo(
    () => [...new Set((favourites || []).map((f) => f.category))],
    [favourites]
  );

  useEffect(() => {
    let cancelled = false;
    queryFoods({
      base,
      search,
      ...filters,
      sortBy,
      preferredCategories,
    }).then((foods) => {
      if (!cancelled) setMeals(foods);
    });
    return () => { cancelled = true; };
    // preferredCategories intentionally excluded — see Home.jsx for why.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, search, filters, sortBy]);

  // Keep the URL in sync (shareable/bookmarkable) without polluting history.
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (base !== 'all') params.type = base;
    if (filters.category) params.category = filters.category;
    if (filters.region) params.region = filters.region;
    if (filters.veg !== null) params.veg = String(filters.veg);
    if (filters.minPrice != null) params.minPrice = String(filters.minPrice);
    if (filters.maxPrice != null) params.maxPrice = String(filters.maxPrice);
    if (filters.minRating != null) params.minRating = String(filters.minRating);
    if (filters.spiceLevels.length) params.spice = filters.spiceLevels.join(',');
    if (filters.availableOnly) params.available = 'true';
    if (sortBy) params.sort = sortBy;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, base, filters, sortBy]);

  const showAlert = (text) => {
    setAlertMsg(text);
    setTimeout(() => setAlertMsg(''), 1000);
  };

  const isFavourite = (meal) => (favourites || []).some((f) => f.id === meal.id);
  const quantityInCart = (meal) => (cart || []).find((c) => c.id === meal.id)?.quantity || 0;

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

  const hasActiveFilters = Object.keys(EMPTY_FILTERS).some((key) => (
    Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key] !== EMPTY_FILTERS[key]
  ));

  const { title, subtitle } = computeHeading(search, base, filters);

  return (
    <div className="page-section">
      <div className="menu-toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <div className="menu-toolbar__controls">
          <button
            type="button"
            className={`btn btn--outline ${filtersOpen ? 'is-active' : ''}`}
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            <FilterIcon /> Filters{hasActiveFilters ? ' •' : ''}
          </button>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      <div className="menu-toolbar__bases">
        {BASE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`filter-chip ${base === opt.value ? 'is-active' : ''}`}
            onClick={() => setBase(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className={`menu-layout ${filtersOpen ? 'menu-layout--filters-open' : ''}`}>
        {filtersOpen && (
          <FilterPanel
            filters={filters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onReset={() => setFilters(EMPTY_FILTERS)}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        <div className="menu-results">
          <div className="page-section__header">
            <div>
              <h2>{title}</h2>
              {subtitle && <p className="discovery-section__subtitle">{subtitle}</p>}
            </div>
            <span className="page-section__count">{meals.length} item{meals.length === 1 ? '' : 's'}</span>
          </div>

          {alertMsg && (
            <div className="toast">
              <CheckCircleIcon /> {alertMsg}
            </div>
          )}

          {meals.length === 0 ? (
            <div className="empty-state">
              <h3>No dishes match your search</h3>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="food-list">
              {meals.map((meal) => (
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
          )}
        </div>
      </div>
    </div>
  )
}
