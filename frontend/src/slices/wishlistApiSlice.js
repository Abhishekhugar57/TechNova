import { apiSlice } from './apiSlice';
import { WISHLIST_URL } from '../constants';

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: WISHLIST_URL,
      }),
      providesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    getWishlistStatus: builder.query({
      query: (productId) => ({
        url: `${WISHLIST_URL}/status/${productId}`,
      }),
      providesTags: (result, error, productId) => [
        { type: 'Wishlist', id: `STATUS_${productId}` },
      ],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: WISHLIST_URL,
        method: 'POST',
        body: { productId },
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const pid = String(productId);
        const patch = dispatch(
          wishlistApiSlice.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (!draft) return;
            if (!draft.productIds.map(String).includes(pid)) {
              draft.productIds.push(pid);
              draft.count = draft.productIds.length;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `${WISHLIST_URL}/${productId}`,
        method: 'DELETE',
      }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const pid = String(productId);
        const patch = dispatch(
          wishlistApiSlice.util.updateQueryData('getWishlist', undefined, (draft) => {
            if (!draft) return;
            draft.productIds = draft.productIds.filter((id) => String(id) !== pid);
            draft.items = draft.items.filter(
              (item) => String(item.product._id) !== pid
            );
            draft.count = draft.productIds.length;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useGetWishlistStatusQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;

export default wishlistApiSlice;
