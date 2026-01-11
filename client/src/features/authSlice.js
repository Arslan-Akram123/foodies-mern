import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Helper to get user from localStorage
const getUserFromStorage = () => {
  const user = localStorage.getItem('userInfo');
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// --- Async Thunks ---

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/users/signup', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/users/login', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Refresh profile to get latest data/avatar from DB
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await API.get('/users/profile');
    const existingInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updatedInfo = { ...existingInfo, ...response.data };
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return response.data;
  } catch (error) {
    localStorage.removeItem('userInfo');
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const response = await API.put('/users/profile', userData);
    const existingInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updatedInfo = { ...existingInfo, ...response.data };
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('userInfo');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. ALL addCase calls must come FIRST
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isError = false;
      })

      // 2. addMatcher calls come SECOND
      /* Authentication Success */
      .addMatcher(
        (action) => [register.fulfilled.type, login.fulfilled.type].includes(action.type),
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload;
        }
      )
      /* Profile Update / Refresh Success */
      .addMatcher(
        (action) => [getMe.fulfilled.type, updateProfile.fulfilled.type].includes(action.type),
        (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = { ...state.user, ...action.payload }; // Real-time state merge
        }
      )
      /* Global Loading State */
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
        }
      )
      /* Global Error State */
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
          // If profile fetch fails, logout user
          if (action.type.includes('getMe')) state.user = null;
        }
      );
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;