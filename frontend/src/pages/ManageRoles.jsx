import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchRoles,
  createRole,
  deleteRole,
} from '../redux/tasksSlice';

export default function ManageRoles() {
  const dispatch = useDispatch();

  const {
    roles,
    loading,
    error,
  } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createRole({
        name: form.name.trim(),
        description: form.description.trim(),
      })
    );

    if (createRole.fulfilled.match(result)) {
      alert('Role created successfully.');

      setForm({
        name: '',
        description: '',
      });
    } else {
      alert(
        result.payload || 'Failed to create role'
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this role?'
      )
    ) {
      return;
    }

    const result = await dispatch(deleteRole(id));

    if (!deleteRole.fulfilled.match(result)) {
      alert(
        result.payload || 'Failed to delete role'
      );
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
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>
          Manage Roles
        </h2>

        
        <form
          onSubmit={handleSubmit}
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
            Create New Role
          </h3>

          <input
            type="text"
            placeholder="Role Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
            style={{
              width: '100%',
              padding: 11,
              marginBottom: 10,
              border: '1px solid #ccc',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />

          <input
            type="text"
            placeholder="Role Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            style={{
              width: '100%',
              padding: 11,
              marginBottom: 10,
              border: '1px solid #ccc',
              borderRadius: 6,
              boxSizing: 'border-box',
            }}
          />

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
            {loading ? 'Creating...' : 'Create Role'}
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
            Available Roles
          </h3>

          {error && (
            <p style={{ color: '#dc3545' }}>
              {error}
            </p>
          )}

          {roles.length === 0 ? (
            <p style={{ color: '#777' }}>
              No roles found.
            </p>
          ) : (
            roles.map((role) => (
              <div
                key={role._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 15,
                  padding: 15,
                  borderBottom:
                    '1px solid #eee',
                }}
              >
                <div>
                  <strong
                    style={{
                      textTransform: 'capitalize',
                    }}
                  >
                    {role.name}
                  </strong>

                  {role.isSystem && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        background: '#eee',
                        padding: '3px 7px',
                        borderRadius: 10,
                      }}
                    >
                      Built-in
                    </span>
                  )}

                  {role.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: '#777',
                        marginTop: 4,
                      }}
                    >
                      {role.description}
                    </div>
                  )}
                </div>

                {!role.isSystem && (
                  <button
                    onClick={() =>
                      handleDelete(role._id)
                    }
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '7px 12px',
                      borderRadius: 5,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}