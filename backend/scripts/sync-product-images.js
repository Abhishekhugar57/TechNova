import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PRODUCT_IMAGE_CATALOG from '../data/productImageCatalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../..');
const imagesDir = path.join(rootDir, 'frontend/public/images/products');
const productsPath = path.join(rootDir, 'backend/data/products.js');
const fallbackSlug = 'fallback';

const downloadImage = async (url, destPath) => {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
};

const updateProductImages = async () => {
  fs.mkdirSync(imagesDir, { recursive: true });

  const failed = [];

  for (const entry of PRODUCT_IMAGE_CATALOG) {
    const dest = path.join(imagesDir, `${entry.slug}.webp`);
    try {
      await downloadImage(entry.source, dest);
      console.log(`Downloaded: ${entry.slug}`);
    } catch (err) {
      failed.push({ name: entry.name, error: err.message });
    }
  }

  // Fallback image (generic electronics)
  const fallbackDest = path.join(imagesDir, `${fallbackSlug}.webp`);
  if (!fs.existsSync(fallbackDest)) {
    await downloadImage(
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp',
      fallbackDest
    );
    console.log('Downloaded: fallback');
  }

  if (failed.length) {
    console.error('Download failures:', failed);
    process.exit(1);
  }

  let content = fs.readFileSync(productsPath, 'utf8');

  for (const entry of PRODUCT_IMAGE_CATALOG) {
    const localPath = `/images/products/${entry.slug}.webp`;
    const escapedName = entry.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(name: '${escapedName}',\\s*\\n\\s*image: ')[^']+(')`,
      'm'
    );

    if (!regex.test(content)) {
      console.error(`Product not found in products.js: ${entry.name}`);
      process.exit(1);
    }

    content = content.replace(regex, `$1${localPath}$2`);
  }

  fs.writeFileSync(productsPath, content);
  console.log(`Updated ${PRODUCT_IMAGE_CATALOG.length} products with local image paths.`);
};

updateProductImages().catch((err) => {
  console.error(err);
  process.exit(1);
});
