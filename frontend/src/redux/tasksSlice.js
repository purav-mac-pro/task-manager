import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/tasks');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load tasks');
    }
  }
);

export const fetchEmployees = createAsyncThunk(
  'tasks/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/auth/employees');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load employees');
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  'tasks/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to load users');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/api/tasks', taskData);
      dispatch(fetchTasks()); 
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      await api.put(`/api/tasks/${id}`, data);
      dispatch(fetchTasks());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      dispatch(fetchTasks());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to delete task');
    }
  }
);

export const createUser = createAsyncThunk(
  'tasks/createUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/api/admin/create-user', userData);
      dispatch(fetchAdminUsers());
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to create user');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],        
    employees: [],     
    adminUsers: [],     
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending , ( state ) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled , ( state , action ) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected , ( state , action ) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.fulfilled , ( state , action ) => {
        state.employees = action.payload;
      })
      .addCase(fetchAdminUsers.fulfilled , ( state , action ) => {
        state.adminUsers = action.payload;
      })
      .addCase(createTask.rejected , ( state , action ) => {
        state.error = action.payload;
      })
      .addCase(updateTask.rejected , ( state , action ) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.rejected , ( state , action ) => {
        state.error = action.payload;
      })
      .addCase(createUser.rejected , ( state , action ) => {
        state.error = action.payload;
      });
  },
});

export default tasksSlice.reducer;