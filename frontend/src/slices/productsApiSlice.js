import { PRODUCTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber, category }) => ({
        url: PRODUCTS_URL,
        params: {
          ...(keyword ? { keyword } : {}),
          ...(pageNumber ? { pageNumber } : {}),
          ...(category ? { category } : {}),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Products', id: _id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }, { type: 'Products', id: 'CATEGORIES' }, { type: 'Products', id: 'TOP' }],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'CATEGORIES' },
        { type: 'Products', id: 'TOP' },
        { type: 'Product', id: productId },
      ],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }, { type: 'Products', id: 'CATEGORIES' }, { type: 'Products', id: 'TOP' }],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: `${productId}-review-eligibility` },
        { type: 'Products', id: 'LIST' },
        { type: 'Products', id: 'TOP' },
      ],
    }),
    getReviewEligibility: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/reviews/eligibility`,
      }),
      providesTags: (result, error, productId) => [
        { type: 'Product', id: `${productId}-review-eligibility` },
      ],
    }),
    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      providesTags: [{ type: 'Products', id: 'TOP' }],
    }),
    getProductCategories: builder.query({
      query: () => `${PRODUCTS_URL}/categories`,
      providesTags: [{ type: 'Products', id: 'CATEGORIES' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetReviewEligibilityQuery,
  useGetTopProductsQuery,
  useGetProductCategoriesQuery,
} = productsApiSlice;
