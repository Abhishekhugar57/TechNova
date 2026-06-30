import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import { ensureTrackingFields } from '../utils/orderTracking.js';

dotenv.config();

const migrateOrderTracking = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const orders = await Order.find({
    $or: [
      { trackingStatus: { $exists: false } },
      { trackingHistory: { $exists: false } },
      { trackingHistory: { $size: 0 } },
    ],
  });

  let updated = 0;

  for (const order of orders) {
    const plain = order.toObject();
    ensureTrackingFields(plain);

    order.trackingStatus = plain.trackingStatus;
    order.trackingHistory = plain.trackingHistory;

    await order.save();
    updated += 1;
  }

  console.log(`Migrated ${updated} order(s) with tracking fields`);
  await mongoose.disconnect();
  process.exit(0);
};

migrateOrderTracking().catch((err) => {
  console.error(err);
  process.exit(1);
});
