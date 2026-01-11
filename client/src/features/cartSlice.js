import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// --- UTILITY: Re-calculate totals from items array ---
const calculateTotals = (items) => {
  const totalQuantity = items.reduce((acc, item) => acc + item.qty, 0);
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  return { totalQuantity, totalAmount };
};

// 1. Fetch Cart from DB (Used on App Startup)
export const fetchCart = createAsyncThunk('cart/fetch', async (_, thunkAPI) => {
  try {
    const response = await API.get('/cart');
    // If backend returns a cart object, return its items, otherwise empty array
    return response.data.items || []; 
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Add or Update Item in DB
// itemData: { food: _id, name, image, price, qty }
export const addToCartDB = createAsyncThunk('cart/add', async (itemData, thunkAPI) => {
  try {
    const response = await API.post('/cart', itemData);
    return response.data; // Full cart object from updated controller
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Remove Item from DB
// id: product/food ID
export const removeFromCartDB = createAsyncThunk('cart/remove', async (id, thunkAPI) => {
  try {
    const response = await API.delete(`/cart/${id}`);
    return response.data; // Full cart object after removal
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { 
    items: [], 
    totalQuantity: 0, 
    totalAmount: 0, 
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    // Reset state locally (useful for logout or order success)
    clearCartLocal: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.isError = false;
      state.message = '';
    },
    resetCartStatus: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      /* FETCH CART */
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })
      
      /* ADD TO CART / UPDATE QTY */
      .addCase(addToCartDB.pending, (state) => { state.isLoading = true; })
      .addCase(addToCartDB.fulfilled, (state, action) => {
        state.isLoading = false;
        // Controller returns full cart object, we extract items
        state.items = action.payload.items; 
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })

      /* REMOVE FROM CART */
      .addCase(removeFromCartDB.pending, (state) => { state.isLoading = true; })
      .addCase(removeFromCartDB.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        const { totalQuantity, totalAmount } = calculateTotals(state.items);
        state.totalQuantity = totalQuantity;
        state.totalAmount = totalAmount;
      })

      /* GLOBAL ERROR HANDLER */
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  }
});

// 1. Export local actions
export const { clearCartLocal, resetCartStatus } = cartSlice.actions;

// 2. Export bundled cartActions for components
// This allows: dispatch(cartActions.addToCart(data))
export const cartActions = {
  addToCart: addToCartDB,
  removeFromCart: removeFromCartDB,
  fetchCart: fetchCart,
  clearCart: clearCartLocal
};

export default cartSlice.reducer;