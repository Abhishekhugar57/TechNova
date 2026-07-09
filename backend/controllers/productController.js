import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';
import { LIST_PRODUCT_FIELDS, TOP_PRODUCT_FIELDS } from '../utils/queryFields.js';
import interleaveProductsByBrand from '../utils/interleaveProductsByBrand.js';
import { getReviewEligibilityForUser } from '../utils/reviewEligibility.js';

const recalculateProductRating = (product) => {
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
};

const DEFAULT_PAGE_SIZE = 8;

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(process.env.PAGINATION_LIMIT) || DEFAULT_PAGE_SIZE;
  const page = Number(req.query.pageNumber) || 1;

  const filters = {};

  if (req.query.keyword) {
    filters.name = {
      $regex: req.query.keyword,
      $options: 'i',
    };
  }

  if (req.query.category) {
    filters.category = req.query.category;
  }

  const count = await Product.countDocuments(filters);

  const allProducts = await Product.find(filters)
    .select(`${LIST_PRODUCT_FIELDS} description`)
    .sort({ createdAt: -1 })
    .lean();

  const interleavedProducts = interleaveProductsByBrand(allProducts);
  const startIndex = pageSize * (page - 1);
  const products = interleavedProducts.slice(startIndex, startIndex + pageSize);

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // NOTE: checking for valid ObjectId to prevent CastError moved to separate
  // middleware. See README for more info.

  const product = await Product.findById(req.params.id).lean();
  if (product) {
    return res.json(product);
  } else {
    // NOTE: this will run if a valid ObjectId but no product was found
    // i.e. product may be null
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
  } = req.body;

  const product = new Product({
    name: name || 'Sample name',
    price: price ?? 0,
    user: req.user._id,
    image: image || '/images/products/fallback.webp',
    brand: brand || 'Sample brand',
    category: category || 'Sample category',
    countInStock: countInStock ?? 0,
    numReviews: 0,
    description: description || 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Check if logged-in user can review a product
// @route   GET /api/products/:id/reviews/eligibility
// @access  Private
const getReviewEligibility = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select('reviews').lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const eligibility = await getReviewEligibilityForUser(
    req.user._id,
    req.params.id
  );

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  res.json({
    ...eligibility,
    ...(existingReview && {
      existingReview: {
        _id: existingReview._id,
        rating: existingReview.rating,
        comment: existingReview.comment,
      },
    }),
  });
});

// @desc    Create or update a verified purchase review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const eligibility = await getReviewEligibilityForUser(
    req.user._id,
    req.params.id
  );

  if (!eligibility.canReview) {
    res.status(403);
    throw new Error('You can review this product only after receiving your order.');
  }

  const existingReview = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    existingReview.name = req.user.name;
    existingReview.rating = Number(rating);
    existingReview.comment = comment;

    recalculateProductRating(product);
    await product.save();
    return res.json({ message: 'Review updated' });
  }

  product.reviews.push({
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  });

  recalculateProductRating(product);
  await product.save();
  res.status(201).json({ message: 'Review added' });
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ category: { $ne: 'Cameras' } })
    .select(TOP_PRODUCT_FIELDS)
    .sort({ rating: -1 })
    .limit(5)
    .lean();

  res.json(products);
});

// @desc    Get product categories with counts
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    categories.map(({ _id, count }) => ({
      name: _id,
      count,
    }))
  );
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getReviewEligibility,
  createProductReview,
  getTopProducts,
  getProductCategories,
};
