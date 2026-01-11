import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const fetchBlogs = createAsyncThunk('blogs/fetch', async (_, thunkAPI) => {
  try {
    const response = await API.get('/blogs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
export const fetchBlogById = createAsyncThunk('blogs/fetchSingle', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
export const createBlogAction = createAsyncThunk('blogs/create', async (blogData, thunkAPI) => {
  try {
    const response = await API.post('/blogs', blogData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateBlogAction = createAsyncThunk('blogs/update', async ({ id, blogData }, thunkAPI) => {
  try {
    const response = await API.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});
const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [], isLoading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => { state.isLoading = true; })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload;
      }).addCase(createBlogAction.fulfilled, (state, action) => { state.blogs.push(action.payload); })
      .addCase(updateBlogAction.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(blog => blog._id === action.payload._id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      }).addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload; 
      })
  },
});

export default blogSlice.reducer;