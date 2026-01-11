import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const getActiveBanners = createAsyncThunk('banners/getActive', async (_, thunkAPI) => {
  try {
    const response = await API.get('/banners');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const bannerSlice = createSlice({
  name: 'banners',
  initialState: { 
    banners: [], 
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetBanner: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getActiveBanners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getActiveBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload;
      })
      .addCase(getActiveBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetBanner } = bannerSlice.actions;
export default bannerSlice.reducer; // Ensure this is default export