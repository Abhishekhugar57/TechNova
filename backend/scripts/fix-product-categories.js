import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, '../data/products.js');

const CATEGORY_BY_NAME = {
  'Airpods Wireless Bluetooth Headphones': 'Headphones & Earbuds',
  'iPhone 13 Pro 256GB Memory': 'Smartphones',
  'Cannon EOS 80D DSLR Camera': 'Cameras',
  'Sony Playstation 5': 'Gaming Accessories',
  'Logitech G-Series Gaming Mouse': 'Gaming Accessories',
  'Amazon Echo Dot 3rd Generation': 'Speakers',
  'Samsung Galaxy S24 Ultra 512GB': 'Smartphones',
  'MacBook Air 15-inch M3 Chip': 'Laptops',
  'Sony WH-1000XM5 Wireless Headphones': 'Headphones & Earbuds',
  'Samsung 55-inch Crystal UHD 4K Smart TV': 'Monitors',
  'Nintendo Switch OLED Model': 'Gaming Accessories',
  'iPad Air 11-inch M2 Chip': 'Tablets',
  'Dell XPS 15 Laptop Intel i7 16GB RAM': 'Laptops',
  'JBL Charge 5 Portable Bluetooth Speaker': 'Speakers',
  'Apple Watch Series 9 GPS 45mm': 'Smartwatches',
  'Samsung Galaxy Buds2 Pro': 'Headphones & Earbuds',
  'Logitech MX Master 3S Wireless Mouse': 'Keyboards & Mice',
};

const CATEGORY_RENAMES = {
  'Headphones/Earbuds': 'Headphones & Earbuds',
  'Keyboards and Mice': 'Keyboards & Mice',
};

let content = fs.readFileSync(productsPath, 'utf8');

for (const [name, category] of Object.entries(CATEGORY_BY_NAME)) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(name: '${escapedName}',[\\s\\S]*?category: ')[^']+(')`,
    'm'
  );
  if (!regex.test(content)) {
    console.error('Missing product:', name);
    process.exit(1);
  }
  content = content.replace(regex, `$1${category}$2`);
}

for (const [oldCat, newCat] of Object.entries(CATEGORY_RENAMES)) {
  content = content.replaceAll(`category: '${oldCat}'`, `category: '${newCat}'`);
}

fs.writeFileSync(productsPath, content);
console.log('Product categories updated.');
