import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const getActiveDeals = createAsyncThunk('deals/getActive', async (_, thunkAPI) => {
  try {
    const response = await API.get('/deals');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const dealSlice = createSlice({
  name: 'deals',
  initialState: { 
    deals: [], 
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetDeal: (state) => {
      state.isLoading = false;
      state.isError = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveDeals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveDeals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deals = action.payload;
      })
      .addCase(getActiveDeals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDeal } = dealSlice.actions;
export default dealSlice.reducer;