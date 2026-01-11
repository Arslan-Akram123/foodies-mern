import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

// Helper to get user from localStorage
const getUserFromStorage = () => {
  const user = localStorage.getItem('userInfo');
  return user ? JSON.parse(user) : null;
};

const initialState = {
  user: getUserFromStorage(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// 1. Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/users/signup', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 2. Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/users/login', userData);
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 3. Update User Profile (Real-time Population)
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const response = await API.put('/users/profile', userData);
    
    // Get existing user info to preserve the Token while updating name/email/avatar
    const existingInfo = JSON.parse(localStorage.getItem('userInfo'));
    const updatedInfo = { ...existingInfo, ...response.data };
    
    // Sync Local Storage
    localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
    
    return response.data; // This updates the Redux state
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// 4. Logout user
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
      /* REGISTER */
      .addCase(register.pending, (state) => { state.isLoading = true; })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      /* LOGIN */
      .addCase(login.pending, (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })

      /* UPDATE PROFILE (Populates UI Real-time) */
      .addCase(updateProfile.pending, (state) => { state.isLoading = true; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Merge the existing user data with the updated data from server
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* LOGOUT */
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;