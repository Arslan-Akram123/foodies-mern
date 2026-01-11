import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const getFoods = createAsyncThunk('foods/getAll', async (filterData, thunkAPI) => {
  try {
    const { category, keyword } = filterData || {};
    let url = '/foods?';
    
    if (category && category !== 'All') url += `category=${category}&`;
    if (keyword) url += `keyword=${keyword}`;

    const response = await API.get(url);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
// Add these to your existing foodSlice.js imports
export const createFood = createAsyncThunk('foods/create', async (foodData, thunkAPI) => {
    try {
        const response = await API.post('/foods', foodData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateFoodAction = createAsyncThunk('foods/update', async ({ id, foodData }, thunkAPI) => {
    try {
        const response = await API.put(`/foods/${id}`, foodData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const deleteFoodAction = createAsyncThunk('foods/delete', async (id, thunkAPI) => {
    try {
        await API.delete(`/foods/${id}`);
        return id; // Return ID to remove it from state
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});



const foodSlice = createSlice({
    name: 'foods',
    initialState: { foods: [], isLoading: false, isSuccess: false, isError: false, message: '' },
    reducers: {
        resetFood: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFoods.pending, (state) => { state.isLoading = true; })
            .addCase(getFoods.fulfilled, (state, action) => {
                state.isLoading = false;
                state.foods = action.payload;
            })
            .addCase(getFoods.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            }).addCase(createFood.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.foods.push(action.payload);
            }).addCase(updateFoodAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.foods.findIndex(food => food._id === action.payload._id);
                if (index !== -1) {
                    state.foods[index] = action.payload;
                }
            }).addCase(deleteFoodAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.foods = state.foods.filter((food) => food._id !== action.payload);
            })
    },
});

export const { resetFood } = foodSlice.actions;
export default foodSlice.reducer;