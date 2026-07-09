const EXCLUDED_HERO_CATEGORIES = new Set(['Cameras']);

export const filterHeroProducts = (products) =>
  (products ?? []).filter((product) => {
    const category = product.category?.trim();
    return category && !EXCLUDED_HERO_CATEGORIES.has(category);
  });
