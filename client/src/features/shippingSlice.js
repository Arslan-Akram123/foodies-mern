import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Get current shipping settings from DB
export const getShippingConfig = createAsyncThunk('shipping/getConfig', async (_, thunkAPI) => {
  try {
    const response = await API.get('/shipping');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update settings (Admin Only)
export const updateShippingConfig = createAsyncThunk('shipping/update', async (configData, thunkAPI) => {
  try {
    const response = await API.post('/shipping', configData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const shippingSlice = createSlice({
  name: 'shipping',
  initialState: { config: null, isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getShippingConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      .addCase(updateShippingConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      });
  }
});

export default shippingSlice.reducer;