import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/orderModel.js';

dotenv.config();

const PAYMENT_CURRENCY = 'INR';

const getRazorpayCredentials = () => ({
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
});

const getRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayCredentials();

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

const toRazorpayAmount = (inrAmount) =>
  Math.round(Number(inrAmount) * 100);

export const isRazorpayConfigured = () => {
  const { keyId, keySecret } = getRazorpayCredentials();
  return Boolean(keyId && keySecret);
};

export const getRazorpayKeyId = () => getRazorpayCredentials().keyId;

export const createRazorpayOrder = async (inrAmount, receipt) => {
  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }

  return razorpay.orders.create({
    amount: toRazorpayAmount(inrAmount),
    currency: PAYMENT_CURRENCY,
    receipt,
  });
};

export const verifyRazorpaySignature = (razorpayOrderId, paymentId, signature) => {
  const { keySecret } = getRazorpayCredentials();
  const body = `${razorpayOrderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

export const fetchRazorpayPayment = async (paymentId) => {
  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }

  return razorpay.payments.fetch(paymentId);
};

export const checkIfNewRazorpayPayment = async (paymentId) => {
  const existingOrder = await Order.findOne({ razorpayPaymentId: paymentId });
  return !existingOrder;
};

export { PAYMENT_CURRENCY, toRazorpayAmount };
