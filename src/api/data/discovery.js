// Curated UI configuration for the Home page's discovery section (Featured
// Collections + Explore by Region) and the Menu page's header. Purely
// presentational — every entry here just carries a { type, value } filter
// that gets handed to getFoodsByFilter() in src/api/foodApi.js, which is
// the single place filtering logic actually lives. Adding a new dish never
// requires touching this file; it only needs a matching category/region/tag
// on the dish itself to show up in the right places.
//
// Images are reused from src/data/andhraFoods.js (already-verified URLs)
// rather than sourcing new ones.

export const COLLECTIONS = [
  {
    id: 'todays-special',
    title: "Today's Special",
    subtitle: "Hand-picked dishes we're spotlighting today",
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Steamed_Rice_with_Gongura_chicken.jpg',
    filter: { type: 'special', value: null },
  },
  {
    id: 'popular-dishes',
    title: 'Popular Dishes',
    subtitle: 'Most-ordered across all of Andhra',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Chicken_65.jpg/960px-Chicken_65.jpg',
    filter: { type: 'popular', value: null },
  },
  {
    id: 'top-rated',
    title: 'Top Rated',
    subtitle: 'Our highest-rated dishes, unfiltered',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Hyderabadi_Chicken_Biryani.jpg/960px-Hyderabadi_Chicken_Biryani.jpg',
    filter: { type: 'topRated', value: null },
  },
  {
    id: 'recommended',
    title: 'Recommended for You',
    subtitle: 'Picked from ratings, popularity & your favourites',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Andhra_prawns_curry.jpg/960px-Andhra_prawns_curry.jpg',
    filter: { type: 'recommended', value: null },
  },
  {
    id: 'breakfast',
    title: 'Breakfast',
    subtitle: 'Start the day the Andhra way',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg',
    filter: { type: 'category', value: 'Breakfast' },
  },
  {
    id: 'andhra-meals',
    title: 'Andhra Meals',
    subtitle: 'Full thalis, unlimited rice',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Andhra_Combo_Meal.JPG/960px-Andhra_Combo_Meal.JPG',
    filter: { type: 'category', value: 'Meals' },
  },
  {
    id: 'biryani-collection',
    title: 'Biryani Collection',
    subtitle: 'Dum-cooked, layered & aromatic',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Hyderabadi_mutton_biryani.jpg',
    filter: { type: 'category', value: 'Biryani' },
  },
  {
    id: 'chicken',
    title: 'Chicken',
    subtitle: 'Fiery Andhra chicken specialities',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Steamed_Rice_with_Gongura_chicken.jpg',
    filter: { type: 'category', value: 'Chicken' },
  },
  {
    id: 'mutton',
    title: 'Mutton',
    subtitle: 'Slow-cooked, richly spiced',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Mutton_Chettinad.jpg/960px-Mutton_Chettinad.jpg',
    filter: { type: 'category', value: 'Mutton' },
  },
  {
    id: 'seafood-specials',
    title: 'Seafood Specials',
    subtitle: 'Fresh off the Andhra coast',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Fish_Pulusu_FoodBells_of_WELLBELLS_Guntur_Andhra_Pradesh.jpg/960px-Fish_Pulusu_FoodBells_of_WELLBELLS_Guntur_Andhra_Pradesh.jpg',
    filter: { type: 'category', value: 'Seafood' },
  },
  {
    id: 'vegetarian-favourites',
    title: 'Vegetarian Favourites',
    subtitle: 'Comfort food, plant-powered',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Gutti_vankaya_curry.jpg/960px-Gutti_vankaya_curry.jpg',
    filter: { type: 'category', value: 'Vegetarian' },
  },
  {
    id: 'snacks',
    title: 'Snacks',
    subtitle: 'Crispy, spicy street favourites',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Andhra_famous_mirchi_bajji.JPG/960px-Andhra_famous_mirchi_bajji.JPG',
    filter: { type: 'category', value: 'Snacks' },
  },
  {
    id: 'sweets',
    title: 'Sweets',
    subtitle: 'Traditional Andhra desserts',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Pootharekulu-Sweets.jpg',
    filter: { type: 'category', value: 'Sweets' },
  },
  {
    id: 'drinks',
    title: 'Drinks',
    subtitle: 'Refreshing, traditional beverages',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/South_Indian_Filter_Coffee.jpg/960px-South_Indian_Filter_Coffee.jpg',
    filter: { type: 'category', value: 'Drinks' },
  },
];

export const REGION_CARDS = [
  { name: 'Guntur', emoji: '🌶️', tagline: 'Fiery & bold' },
  { name: 'Nellore', emoji: '🐟', tagline: 'Coastal classics' },
  { name: 'Godavari', emoji: '🍤', tagline: 'Delta seafood & sweets' },
  { name: 'Rayalaseema', emoji: '🍗', tagline: 'Rustic & spicy' },
];

// Resolves a { type, value } filter (e.g. from Menu.jsx's URL params) back
// to display copy, reusing the same COLLECTIONS/REGION_CARDS metadata Home
// uses — so titles/subtitles never have to be authored twice.
export function resolveFilterMeta(type, value) {
  if (type === 'category') {
    const collection = COLLECTIONS.find((c) => c.filter.type === 'category' && c.filter.value === value);
    return { title: collection?.title ?? value ?? 'Dishes', subtitle: collection?.subtitle ?? `Only ${value} dishes` };
  }
  if (type === 'region') {
    const region = REGION_CARDS.find((r) => r.name === value);
    return { title: region ? `${region.name} Specials` : 'Region Specials', subtitle: region?.tagline ?? `Dishes from ${value}` };
  }
  const collection = COLLECTIONS.find((c) => c.filter.type === type);
  return { title: collection?.title ?? 'Popular Dishes', subtitle: collection?.subtitle ?? '' };
}
