/**
 * Reorders products so brands are spread evenly using round-robin selection.
 * Products within each brand queue keep their original relative order.
 */
const interleaveProductsByBrand = (products) => {
  if (!products?.length) {
    return [];
  }

  const brandQueues = new Map();

  for (const product of products) {
    const brand = product.brand?.trim() || 'Other';
    if (!brandQueues.has(brand)) {
      brandQueues.set(brand, []);
    }
    brandQueues.get(brand).push(product);
  }

  const sortedBrands = [...brandQueues.keys()].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );

  const queues = sortedBrands.map((brand) => brandQueues.get(brand));
  const interleaved = [];
  let hasMore = true;

  while (hasMore) {
    hasMore = false;
    for (const queue of queues) {
      if (queue.length > 0) {
        interleaved.push(queue.shift());
        hasMore = true;
      }
    }
  }

  return interleaved;
};

export default interleaveProductsByBrand;
