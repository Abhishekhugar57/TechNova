import asyncHandler from '../middleware/asyncHandler.js';
import { isValidObjectId } from 'mongoose';
import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

const WISHLIST_PRODUCT_FIELDS =
  'name image brand price rating numReviews countInStock category';

const assertCustomerUser = (req, res) => {
  if (req.user.role === 'admin') {
    res.status(403);
    throw new Error('Admin users cannot use the wishlist');
  }
};

const formatWishlistItem = (entry) => ({
  _id: entry._id,
  product: entry.product,
  addedAt: entry.createdAt,
});

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  assertCustomerUser(req, res);

  const items = await Wishlist.find({ user: req.user._id })
    .populate('product', WISHLIST_PRODUCT_FIELDS)
    .sort({ createdAt: -1 })
    .lean();

  const formatted = items
    .filter((item) => item.product)
    .map(formatWishlistItem);

  res.json({
    items: formatted,
    productIds: formatted.map((item) => item.product._id.toString()),
    count: formatted.length,
  });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  assertCustomerUser(req, res);

  const { productId } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  if (!isValidObjectId(productId)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(productId).select(WISHLIST_PRODUCT_FIELDS).lean();

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const existing = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  });

  if (existing) {
    res.status(400);
    throw new Error('Product is already in your wishlist');
  }

  const entry = await Wishlist.create({
    user: req.user._id,
    product: productId,
  });

  res.status(201).json({
    message: 'Product added to wishlist',
    item: {
      _id: entry._id,
      product,
      addedAt: entry.createdAt,
    },
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  assertCustomerUser(req, res);

  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const entry = await Wishlist.findOneAndDelete({
    user: req.user._id,
    product: productId,
  });

  if (!entry) {
    res.status(404);
    throw new Error('Product not found in wishlist');
  }

  res.json({ message: 'Product removed from wishlist', productId });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/status/:productId
// @access  Private
const getWishlistStatus = asyncHandler(async (req, res) => {
  assertCustomerUser(req, res);

  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    res.status(400);
    throw new Error('Invalid product ID');
  }

  const entry = await Wishlist.findOne({
    user: req.user._id,
    product: productId,
  }).select('_id');

  res.json({
    productId,
    inWishlist: Boolean(entry),
    wishlistItemId: entry?._id || null,
  });
});

export { getWishlist, addToWishlist, removeFromWishlist, getWishlistStatus };
