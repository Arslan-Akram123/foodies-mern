import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Get all reviews for the home page
export const getAllReviews = createAsyncThunk('reviews/getAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/reviews');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: { reviews: [], isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, (state) => { state.isLoading = true; })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      });
  },
});

export default reviewSlice.reducer;