import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import cartReducer from '../features/cartSlice';
import foodReducer from '../features/foodSlice';
import categoryReducer from '../features/categorySlice';
import bannerReducer from '../features/bannerSlice';
import dealReducer from '../features/dealSlice';
import shippingReducer from '../features/shippingSlice';
import orderReducer from '../features/orderSlice';
import blogReducer from '../features/blogSlice';
import reviewReducer from '../features/reviewSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    foods: foodReducer,
    categories: categoryReducer,
    banners: bannerReducer,
    deals: dealReducer,
    shipping: shippingReducer,
    orders: orderReducer,
    blogs: blogReducer,
    reviews: reviewReducer
  },
});