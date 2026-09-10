import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAdminUsers,
  fetchRoles,
  createUser,
  updateUserRole,
  deleteUser,
} from '../redux/tasksSlice';

export default function ManageUsers() {
  const dispatch = useDispatch();

  const {
    adminUsers: users,
    roles,
    loading,
    error,
  } = useSelector((state) => state.tasks);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Employee',
  });

  const [roleEdits, setRoleEdits] = useState({});

  const assignableRoles = roles.filter(
    (role) => role.name !== 'admin'
  );

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (
      assignableRoles.length > 0 &&
      !assignableRoles.some(
        (role) => role.name === userForm.role
      )
    ) {
      setUserForm((prev) => ({
        ...prev,
        role: assignableRoles[0].name,
      }));
    }
  }, [roles]);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createUser(userForm)
    );

    if (createUser.fulfilled.match(result)) {
      alert('User created successfully.');

      setUserForm({
        name: '',
        email: '',
        password: '',
        role:
          assignableRoles[0]?.name ||
          'Employee',
      });
    } else {
      alert(
        result.payload || 'Failed to create user'
      );
    }
  };

  const handleRoleChange = (userId, role) => {
    setRoleEdits((prev) => ({
      ...prev,
      [userId]: role,
    }));
  };

  const handleUpdateRole = async (userId) => {
    const role = roleEdits[userId];

    if (!role) {
      return;
    }

    const result = await dispatch(
      updateUserRole({
        id: userId,
        role,
      })
    );

    if (updateUserRole.fulfilled.match(result)) {
      alert('Role updated successfully.');

      setRoleEdits((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    } else {
      alert(
        result.payload || 'Failed to update role'
      );
    }
  };

  // NEW — delete user handler
  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to Delete "${userName}"?`
      )
    ) {
      return;
    }

    const result = await dispatch(deleteUser(userId));

    if (deleteUser.fulfilled.match(result)) {
      alert('User deleted.');
    } else {
      alert(result.payload || 'Failed to delete user');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        padding: 25,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>
          Manage Users
        </h2>

        
        <form
          onSubmit={handleCreateUser}
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 20,
            maxWidth: 550,
            margin: '0 auto 30px',
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Create New User
          </h3>

          <input
            placeholder="Name"
            value={userForm.name}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                name: e.target.value,
              })
            }
            required
            style={inputStyle}
          />

          <input
            placeholder="Email"
            type="email"
            value={userForm.email}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                email: e.target.value,
              })
            }
            required
            style={inputStyle}
          />

          <input
            placeholder="Password"
            type="password"
            value={userForm.password}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                password: e.target.value,
              })
            }
            required
            style={inputStyle}
          />

          <select
            value={userForm.role}
            onChange={(e) =>
              setUserForm({
                ...userForm,
                role: e.target.value,
              })
            }
            style={inputStyle}
          >
            {assignableRoles.map((role) => (
              <option
                key={role._id}
                value={role.name}
              >
                {role.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 12,
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {loading
              ? 'Creating...'
              : 'Create User'}
          </button>
        </form>

        
        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            All Users
          </h3>

          {error && (
            <p style={{ color: '#dc3545' }}>
              {error}
            </p>
          )}

          {users.length === 0 ? (
            <p style={{ color: '#777' }}>
              No users found.
            </p>
          ) : (
            users
              .filter((user) => user.role !== 'admin')
              .map((user) => {
                const selectedRole =
                  roleEdits[user._id] ??
                  user.role;

                const changed =
                  selectedRole !== user.role;

                return (
                  <div
                    key={user._id}
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: 20,
                      padding: 15,
                      borderBottom:
                        '1px solid #eee',
                      flexWrap: 'wrap',
                    }}
                  >
                    
                    <div
                      style={{
                        flex: 1,
                        minWidth: 220,
                      }}
                    >
                      <strong>
                        {user.name}
                      </strong>

                      <div
                        style={{
                          color: '#777',
                          fontSize: 13,
                          marginTop: 3,
                        }}
                      >
                        {user.email}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          fontSize: 13,
                        }}
                      >
                        Current role:{' '}
                        <strong
                          style={{
                            textTransform:
                              'capitalize',
                          }}
                        >
                          {user.role}
                        </strong>
                      </div>
                    </div>

                    
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <select
                        value={selectedRole}
                        onChange={(e) =>
                          handleRoleChange(
                            user._id,
                            e.target.value
                          )
                        }
                        style={{
                          padding: 9,
                          border:
                            '1px solid #ccc',
                          borderRadius: 6,
                          minWidth: 140,
                        }}
                      >
                        {assignableRoles.map(
                          (role) => (
                            <option
                              key={role._id}
                              value={role.name}
                            >
                              {role.name}
                            </option>
                          )
                        )}
                      </select>

                      <button
                        onClick={() =>
                          handleUpdateRole(
                            user._id
                          )
                        }
                        disabled={!changed}
                        style={{
                          background: changed
                            ? '#222'
                            : '#aaa',
                          color: '#fff',
                          border: 'none',
                          padding:
                            '9px 14px',
                          borderRadius: 6,
                          cursor: changed
                            ? 'pointer'
                            : 'not-allowed',
                        }}
                      >
                        Update Role
                      </button>

                      {/* NEW — delete user button */}
                      <button
                        onClick={() =>
                          handleDeleteUser(
                            user._id,
                            user.name
                          )
                        }
                        style={{
                          background: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '9px 14px',
                          borderRadius: 6,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 11,
  marginBottom: 10,
  border: '1px solid #ccc',
  borderRadius: 6,
  boxSizing: 'border-box',
};