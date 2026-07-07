import { ANDHRA_FOODS, CATEGORIES, REGIONS } from './data/andhraFoods';

// Thin async wrapper around the local dataset, shaped like a real backend
// API (Promise-returning, category/id lookups). Swapping the seed data for
// a live backend later means rewriting only the bodies below — e.g.
// `fetch('/api/foods?category=' + category).then(res => res.json())` —
// callers (Home.jsx, Menu.jsx) never need to change.
const SIMULATED_LATENCY_MS = 200;

function resolveAfterDelay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), SIMULATED_LATENCY_MS));
}

function scoreRecommendedSync(foods, preferredCategories) {
  const maxPopularity = Math.max(...foods.map((food) => food.popularity));
  const preferredSet = new Set(preferredCategories);

  return foods
    .map((food) => {
      const ratingScore = food.rating / 5;
      const popularityScore = food.popularity / maxPopularity;
      const preferenceBoost = preferredSet.has(food.category) ? 0.15 : 0;
      return { food, score: ratingScore * 0.5 + popularityScore * 0.35 + preferenceBoost };
    })
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.food);
}

// Synchronous core shared by getFoodsByFilter() and queryFoods() so the
// six base-selection rules (category/region/special/popular/topRated/
// recommended) are defined in exactly one place.
function selectFoodsSync(type, value, { preferredCategories = [] } = {}) {
  switch (type) {
    case 'category':
      return ANDHRA_FOODS.filter((food) => food.category === value);
    case 'region':
      return ANDHRA_FOODS.filter((food) => food.region === value);
    case 'special':
      return ANDHRA_FOODS.filter((food) => food.tags?.includes('todays-special'));
    case 'topRated':
      return [...ANDHRA_FOODS].sort((a, b) => b.rating - a.rating);
    case 'recommended':
      return scoreRecommendedSync(ANDHRA_FOODS, preferredCategories);
    case 'popular':
    default:
      return [...ANDHRA_FOODS].sort((a, b) => b.popularity - a.popularity);
  }
}

export function getCategories() {
  return resolveAfterDelay(CATEGORIES);
}

export function getFoodsByCategory(category) {
  return resolveAfterDelay(selectFoodsSync('category', category));
}

export function getAllFoods() {
  return resolveAfterDelay(ANDHRA_FOODS);
}

export function getFoodById(id) {
  const food = ANDHRA_FOODS.find((f) => f.id === id) ?? null;
  return resolveAfterDelay(food);
}

export function getRegions() {
  return resolveAfterDelay(REGIONS);
}

export function getFoodsByRegion(region) {
  return resolveAfterDelay(selectFoodsSync('region', region));
}

// Dishes editorially flagged as today's special (data/andhraFoods.js `tags`),
// not derived from rating/popularity — a genuinely separate curated list.
export function getTodaysSpecials() {
  return resolveAfterDelay(selectFoodsSync('special'));
}

// Highest order-volume dishes — distinct signal from rating, so this and
// "Top Rated" don't just duplicate each other.
export function getPopularFoods() {
  return resolveAfterDelay(selectFoodsSync('popular'));
}

export function getTopRatedFoods() {
  return resolveAfterDelay(selectFoodsSync('topRated'));
}

// Blends rating + popularity, with an optional boost for categories the
// caller says the user prefers (e.g. Home.jsx derives this from the real
// favourites list already held in App state — no fabricated profile data).
export function getRecommendedFoods(preferredCategories = []) {
  return resolveAfterDelay(selectFoodsSync('recommended', null, { preferredCategories }));
}

// Reusable dispatch used by Home's collection/region cards.
// `filter` is { type: 'category' | 'region' | 'special' | 'popular' | 'topRated' | 'recommended', value? }.
export function getFoodsByFilter(filter, options = {}) {
  return resolveAfterDelay(selectFoodsSync(filter?.type, filter?.value, options));
}

const SORTERS = {
  popularity: (a, b) => b.popularity - a.popularity,
  rating: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
};

export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Highest Rating' },
  { value: 'priceAsc', label: 'Price: Low → High' },
  { value: 'priceDesc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest' },
];

// The Menu page's Smart Search + Advanced Filters + Sorting, all combinable
// (search AND category AND region AND veg AND price range AND rating AND
// spice level AND availability, then sorted). Built on selectFoodsSync so
// the base-selection rules stay identical to getFoodsByFilter's.
//
// params:
//   base            'popular' | 'topRated' | 'special' | 'recommended' | 'all'
//   search          free-text — matches name, category, region, ingredients
//   category        exact category match (independent of `base`)
//   region          exact region match (independent of `base`)
//   veg             true | false | null (any)
//   minPrice/maxPrice
//   minRating
//   spiceLevels     array of 1|2|3; empty/omitted = any
//   availableOnly   boolean
//   sortBy          one of SORT_OPTIONS' values; omitted = base's natural order
//   preferredCategories  passed through to the 'recommended' base
export function queryFoods(params = {}) {
  const {
    base = 'popular',
    search = '',
    category = null,
    region = null,
    veg = null,
    minPrice = null,
    maxPrice = null,
    minRating = null,
    spiceLevels = [],
    availableOnly = false,
    sortBy = null,
    preferredCategories = [],
  } = params;

  let foods = base === 'all'
    ? ANDHRA_FOODS.slice()
    : selectFoodsSync(base, null, { preferredCategories });

  const q = search.trim().toLowerCase();
  if (q) {
    foods = foods.filter((food) =>
      food.name.toLowerCase().includes(q) ||
      food.category.toLowerCase().includes(q) ||
      food.region.toLowerCase().includes(q) ||
      food.ingredients?.some((ingredient) => ingredient.toLowerCase().includes(q))
    );
  }

  if (category) foods = foods.filter((food) => food.category === category);
  if (region) foods = foods.filter((food) => food.region === region);
  if (veg === true) foods = foods.filter((food) => food.type === 'veg');
  if (veg === false) foods = foods.filter((food) => food.type === 'non-veg');
  if (minPrice != null) foods = foods.filter((food) => food.price >= minPrice);
  if (maxPrice != null) foods = foods.filter((food) => food.price <= maxPrice);
  if (minRating != null) foods = foods.filter((food) => food.rating >= minRating);
  if (spiceLevels.length) foods = foods.filter((food) => spiceLevels.includes(food.spiceLevel));
  if (availableOnly) foods = foods.filter((food) => food.available !== false);

  if (sortBy && SORTERS[sortBy]) foods = [...foods].sort(SORTERS[sortBy]);

  return resolveAfterDelay(foods);
}
