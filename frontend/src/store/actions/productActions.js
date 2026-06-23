import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL;

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => '/products',
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: '/products',
        method: 'POST',
        body: formData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } = productApi;
