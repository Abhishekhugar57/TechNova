import {
  FaMobileAlt,
  FaLaptop,
  FaTabletAlt,
  FaClock,
  FaHeadphones,
  FaGamepad,
  FaDesktop,
  FaKeyboard,
  FaCamera,
  FaVolumeUp,
} from 'react-icons/fa';

export const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Tablets',
  'Smartwatches',
  'Headphones & Earbuds',
  'Gaming Accessories',
  'Monitors',
  'Keyboards & Mice',
  'Cameras',
  'Speakers',
];

export const CATEGORY_META = {
  Smartphones: { icon: FaMobileAlt },
  Laptops: { icon: FaLaptop },
  Tablets: { icon: FaTabletAlt },
  Smartwatches: { icon: FaClock },
  'Headphones & Earbuds': { icon: FaHeadphones },
  'Gaming Accessories': { icon: FaGamepad },
  Monitors: { icon: FaDesktop },
  'Keyboards & Mice': { icon: FaKeyboard },
  Cameras: { icon: FaCamera },
  Speakers: { icon: FaVolumeUp },
};

export const categoryToSlug = (category) =>
  category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

const SLUG_TO_CATEGORY = Object.fromEntries(
  PRODUCT_CATEGORIES.map((name) => [categoryToSlug(name), name])
);

export const slugToCategory = (slug) => SLUG_TO_CATEGORY[slug] || null;
