import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';

import api from '../api';

// TASKS
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/tasks');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to load tasks'
      );
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
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to create task'
      );
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
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to update task'
      );
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
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to delete task'
      );
    }
  }
);

// EMPLOYEES
export const fetchEmployees = createAsyncThunk(
  'tasks/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/auth/employees');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to load employees'
      );
    }
  }
);

// ADMIN USERS
export const fetchAdminUsers = createAsyncThunk(
  'tasks/fetchAdminUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/users');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to load users'
      );
    }
  }
);

// CREATE USER
export const createUser = createAsyncThunk(
  'tasks/createUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/api/admin/create-user', userData);
      dispatch(fetchAdminUsers());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to create user'
      );
    }
  }
);

// UPDATE USER ROLE
export const updateUserRole = createAsyncThunk(
  'tasks/updateUserRole',
  async ({ id, role }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role });
      dispatch(fetchAdminUsers());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to update role'
      );
    }
  }
);

// DELETE USER (NEW)
export const deleteUser = createAsyncThunk(
  'tasks/deleteUser',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      dispatch(fetchAdminUsers());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to delete user'
      );
    }
  }
);

// ROLES
export const fetchRoles = createAsyncThunk(
  'tasks/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/api/admin/roles');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to load roles'
      );
    }
  }
);

export const createRole = createAsyncThunk(
  'tasks/createRole',
  async (roleData, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/api/admin/roles', roleData);
      dispatch(fetchRoles());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to create role'
      );
    }
  }
);

export const deleteRole = createAsyncThunk(
  'tasks/deleteRole',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/roles/${id}`);
      dispatch(fetchRoles());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || 'Failed to delete role'
      );
    }
  }
);

// SLICE
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    employees: [],
    adminUsers: [],
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Employees
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
      })

      // Admin users
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.adminUsers = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.loading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Errors
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default tasksSlice.reducer;