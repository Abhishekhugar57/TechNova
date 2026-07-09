import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from '../config/db.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import { USD_TO_INR_RATE } from '../constants/pricing.js';

dotenv.config();

const convertAmount = (value) =>
  Math.round(Number(value) * USD_TO_INR_RATE * 100) / 100;

const migrateUsdToInr = async () => {
  try {
    await connectDB();

    const products = await Product.find({});
    let productUpdates = 0;

    for (const product of products) {
      if (product.price < 1000) {
        product.price = convertAmount(product.price);
        await product.save();
        productUpdates += 1;
      }
    }

    const orders = await Order.find({});
    let orderUpdates = 0;

    for (const order of orders) {
      const looksLikeUsd = Number(order.totalPrice) < 1000;

      if (!looksLikeUsd) {
        continue;
      }

      order.orderItems = order.orderItems.map((item) => ({
        ...item.toObject(),
        price: convertAmount(item.price),
      }));

      order.itemsPrice = convertAmount(order.itemsPrice);
      order.shippingPrice = convertAmount(order.shippingPrice);
      order.taxPrice = convertAmount(order.taxPrice);
      order.totalPrice = convertAmount(order.totalPrice);

      await order.save();
      orderUpdates += 1;
    }

    console.log(
      `Migration complete: ${productUpdates} products and ${orderUpdates} orders updated to INR.`
        .green.inverse
    );
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

migrateUsdToInr();
