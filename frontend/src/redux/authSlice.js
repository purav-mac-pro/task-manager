import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// currently logged-in user
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/auth/me');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Not logged in'
      );
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Login failed'
      );
    }
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Signup failed'
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await api.post('/api/auth/logout');
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,
    loading: true,
    error: null,
  },

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export default authSlice.reducer;