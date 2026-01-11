import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const getCategories = createAsyncThunk('categories/getAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/categories');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: { categories: [], isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default categorySlice.reducer;