import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchRoles, createRole, deleteRole } from '../redux/tasksSlice';
import { IconShield, IconPlus, IconTrash, IconInbox } from '../components/icons';

export default function ManageRoles() {
  const dispatch = useDispatch();

  const { roles, loading, error } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({ name: '', description: '' });

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
      setForm({ name: '', description: '' });
    } else {
      alert(result.payload || 'Failed to create role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role?')) return;

    const result = await dispatch(deleteRole(id));
    if (!deleteRole.fulfilled.match(result)) {
      alert(result.payload || 'Failed to delete role');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Administration</p>
          <h1 className="page-title">Manage Roles</h1>
          <p className="page-subtitle">Define the roles available to assign to users.</p>
        </div>
      </div>

      <div className="container">
        <div className="grid-2">
          <div className="card card-pad">
            <div className="card-title-row" style={{ marginBottom: 18 }}>
              <span className="card-icon">
                <IconPlus size={18} />
              </span>
              <h3>Create New Role</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="label">Role Name</label>
                <input
                  className="input"
                  type="text"
                  placeholder="e.g. Team Lead"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <input
                  className="input"
                  type="text"
                  placeholder="What this role can do"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 4 }}>
                {loading ? 'Creating...' : 'Create Role'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Available Roles ({roles.length})</h3>
            </div>

            {error && (
              <div style={{ padding: '14px 24px 0' }}>
                <div className="form-error-banner" style={{ marginBottom: 0 }}>{error}</div>
              </div>
            )}

            {roles.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconInbox size={40} />
                </div>
                <p className="empty-state-title">No roles found</p>
                <p>Create your first role using the form.</p>
              </div>
            ) : (
              <div className="list">
                {roles.map((role) => (
                  <div key={role._id} className="list-item">
                    <div className="list-item-main">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="card-icon" style={{ width: 28, height: 28 }}>
                          <IconShield size={14} />
                        </span>
                        <span className="list-item-title" style={{ textTransform: 'capitalize' }}>
                          {role.name}
                        </span>
                        {role.isSystem && <span className="badge badge-neutral">Built-in</span>}
                      </div>
                      {role.description && <div className="list-item-desc">{role.description}</div>}
                    </div>

                    {!role.isSystem && (
                      <button
                        onClick={() => handleDelete(role._id)}
                        className="btn btn-danger btn-sm"
                      >
                        <IconTrash size={14} />
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
