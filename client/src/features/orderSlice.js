import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const createOrder = createAsyncThunk('orders/create', async (orderData, thunkAPI) => {
  try {
    const response = await API.post('/orders', orderData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getMyOrders = createAsyncThunk('orders/myOrders', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/myorders');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], currentOrder: null, isLoading: false, isSuccess: false },
  reducers: { resetOrder: (state) => { state.isSuccess = false; } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.isSuccess = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  }
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;