import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';
import { RAZORPAY_URL } from '../utils/loadRazorpay';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }, { type: 'Order', id: 'MINE' }],
    }),
    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createRazorpayOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/razorpay-order`,
        method: 'POST',
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: ({ orderId, paymentDetails }) => ({
        url: `${ORDERS_URL}/${orderId}/razorpay-verify`,
        method: 'POST',
        body: paymentDetails,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
    getRazorpayKeyId: builder.query({
      query: () => ({
        url: RAZORPAY_URL,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      providesTags: [{ type: 'Order', id: 'MINE' }],
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'MINE' },
      ],
    }),
    updateOrderTracking: builder.mutation({
      query: ({ orderId, status, description, location }) => ({
        url: `${ORDERS_URL}/${orderId}/tracking`,
        method: 'PUT',
        body: { status, description, location },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'MINE' },
      ],
    }),
    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `${ORDERS_URL}/${orderId}/cancel`,
        method: 'PUT',
        body: { reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Order', id: 'MINE' },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetRazorpayKeyIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUpdateOrderTrackingMutation,
  useCancelOrderMutation,
} = orderApiSlice;
