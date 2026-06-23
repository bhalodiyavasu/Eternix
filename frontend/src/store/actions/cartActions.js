import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL;

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
    }),
    addToCart: builder.mutation({
      query: (cartData) => ({
        url: '/cart',
        method: 'POST',
        body: cartData,
      }),
    }),
    updateCartItem: builder.mutation({
      query: (cartData) => ({
        url: '/cart',
        method: 'PATCH',
        body: cartData,
      }),
    }),
    removeFromCart: builder.mutation({
      query: (cartData) => ({
        url: '/cart',
        method: 'DELETE',
        body: cartData,
      }),
    }),
  }),
});

export const { useAddToCartMutation, useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } = cartApi;
