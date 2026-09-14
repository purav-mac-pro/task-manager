import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAdminUsers,
  fetchRoles,
  createUser,
  updateUserRole,
  deleteUser,
} from '../redux/tasksSlice';
import { IconPlus, IconTrash, IconInbox } from '../components/icons';

export default function ManageUsers() {
  const dispatch = useDispatch();

  const { adminUsers: users, roles, loading, error } = useSelector((state) => state.tasks);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
  });

  const [roleEdits, setRoleEdits] = useState({});

  const assignableRoles = roles.filter((role) => role.name !== 'admin');

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (assignableRoles.length > 0 && !assignableRoles.some((role) => role.name === userForm.role)) {
      setUserForm((prev) => ({ ...prev, role: assignableRoles[0].name }));
    }
  }, [roles]);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const result = await dispatch(createUser(userForm));

    if (createUser.fulfilled.match(result)) {
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: assignableRoles[0]?.name || 'Employee',
      });
    } else {
      alert(result.payload || 'Failed to create user');
    }
  };

  const handleRoleChange = (userId, role) => {
    setRoleEdits((prev) => ({ ...prev, [userId]: role }));
  };

  const handleUpdateRole = async (userId) => {
    const role = roleEdits[userId];
    if (!role) return;

    const result = await dispatch(updateUserRole({ id: userId, role }));

    if (updateUserRole.fulfilled.match(result)) {
      setRoleEdits((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    } else {
      alert(result.payload || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to Delete "${userName}"?`)) return;

    const result = await dispatch(deleteUser(userId));
    if (!deleteUser.fulfilled.match(result)) {
      alert(result.payload || 'Failed to delete user');
    }
  };

  const visibleUsers = users.filter((user) => user.role !== 'admin');

  const initials = (name) =>
    (name || '?')
      .split(' ')
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Administration</p>
          <h1 className="page-title">Manage Users</h1>
          <p className="page-subtitle">Create accounts and update roles for your team.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid-2">
          <div className="card card-pad">
            <div className="card-title-row" style={{ marginBottom: 18 }}>
              <span className="card-icon">
                <IconPlus size={18} />
              </span>
              <h3>Create New User</h3>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="field">
                <label className="label">Name</label>
                <input
                  className="input"
                  placeholder="Enter name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Email</label>
                <input
                  className="input"
                  placeholder="Enter email address"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Password</label>
                <input
                  className="input"
                  placeholder="Enter password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Role</label>
                <select
                  className="select"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  {assignableRoles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>All Users ({visibleUsers.length})</h3>
            </div>

            {error && (
              <div style={{ padding: '14px 24px 0' }}>
                <div className="form-error-banner" style={{ marginBottom: 0 }}>{error}</div>
              </div>
            )}

            {visibleUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconInbox size={40} />
                </div>
                <p className="empty-state-title">No users found</p>
                <p>Create your first user using the form.</p>
              </div>
            ) : (
              <div className="list">
                {visibleUsers.map((user) => {
                  const selectedRole = roleEdits[user._id] ?? user.role;
                  const changed = selectedRole !== user.role;

                  return (
                    <div key={user._id} className="list-item">
                      <div className="list-item-main" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <span className="avatar">{initials(user.name)}</span>
                        <div>
                          <div className="list-item-title">{user.name}</div>
                          <div className="list-item-desc">{user.email}</div>
                          <div style={{ marginTop: 6 }}>
                            <span className="badge badge-role" style={{ textTransform: 'capitalize' }}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="list-item-actions">
                        <select
                          className="select"
                          style={{ minWidth: 140 }}
                          value={selectedRole}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        >
                          {assignableRoles.map((role) => (
                            <option key={role._id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleUpdateRole(user._id)}
                          disabled={!changed}
                          className="btn btn-secondary btn-sm"
                        >
                          Update Role
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="btn btn-danger btn-sm btn-icon"
                          title="Delete user"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
