# TechNova

TechNova is a full-featured ecommerce platform for premium electronics, built with the MERN stack. It includes a customer storefront, secure checkout, order tracking, wishlist, and a complete admin dashboard.

## Features

- Product catalog with search, categories, and pagination
- Shopping cart and wishlist
- User registration, authentication, and profile management
- Secure checkout with Razorpay payments
- Order history and delivery tracking
- Admin dashboard with analytics, product/user/order management
- Responsive UI with light and dark admin themes

## Tech Stack

- **Frontend:** React, Redux Toolkit, RTK Query, React Bootstrap
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Payments:** Razorpay
- **Auth:** JWT (HTTP-only cookies)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Abhishekhugar57/TechNova.git
cd TechNova
```

2. Install dependencies:

```bash
npm install
cd frontend && npm install && cd ..
```

3. Copy the environment template and configure your values:

```bash
cp .env.example .env
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=<your_mongo_db_uri>
JWT_SECRET=<your_secret>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
RAZORPAY_USD_TO_INR_RATE=84
ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=<secure_admin_password>
PAGINATION_LIMIT=12
```

Never commit your `.env` file or real API keys to version control.

## Running the Project

**Development (frontend + backend):**

```bash
npm run dev
```

- API: http://localhost:5000
- Storefront: http://localhost:3000

**Production build:**

```bash
npm run build
NODE_ENV=production npm start
```

**Seed sample data (optional):**

```bash
npm run data:import
```

**Remove seeded data:**

```bash
npm run data:destroy
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

This project incorporates code originally distributed under the MIT License. If you redistribute this software, retain the original copyright notices required by the MIT License for any substantial portions of the underlying work.
