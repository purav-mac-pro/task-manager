import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTasks,
  fetchAdminUsers,
  createTask,
  deleteTask,
} from '../redux/tasksSlice';
import { IconPlus, IconTrash, IconInbox } from '../components/icons';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { items: tasks, adminUsers: users } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!form.assignedTo) {
      alert('Please select the User');
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createTask(form));
    setSubmitting(false);

    if (createTask.fulfilled.match(result)) {
      setForm({ title: '', description: '', assignedTo: '' });
    } else {
      alert(result.payload || 'Failed to add task');
    }
  };

  const handleDeleteTask = (id) => {
    if (!window.confirm('Delete this task?')) return;
    dispatch(deleteTask(id));
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const progressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Create tasks and keep an eye on everything.</p>
        </div>
      </div>

      <div className="container">
        <div className="stat-row">
          <div className="stat-chip">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-chip accent-warning">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-chip accent-primary">
            <div className="stat-value">{progressCount}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-chip accent-success">
            <div className="stat-value">{doneCount}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card card-pad">
            <div className="card-title-row" style={{ marginBottom: 18 }}>
              <span className="card-icon">
                <IconPlus size={18} />
              </span>
              <h3>Add New Task</h3>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="field">
                <label className="label">Title</label>
                <input
                  className="input"
                  placeholder="e.g. Prepare quarterly report"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  placeholder="Add any helpful context..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="field">
                <label className="label">Assign To</label>
                <select
                  className="select"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  required
                >
                  <option value="">-- Select User --</option>
                  {users
                    .filter((u) => u.role !== 'admin')
                    .map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} - {u.role} ({u.email})
                      </option>
                    ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 4 }}>
                {submitting ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>All Tasks ({tasks.length})</h3>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <IconInbox size={40} />
                </div>
                <p className="empty-state-title">No tasks yet</p>
                <p>Create your first task using the form.</p>
              </div>
            ) : (
              <div className="list">
                {tasks.map((t) => (
                  <div key={t._id} className="list-item">
                    <div className="list-item-main">
                      <div className="list-item-title">{t.title}</div>
                      <div className="list-item-desc">{t.description || 'No description'}</div>
                      <div className="list-item-meta">
                        <span>
                          Assigned to <b>{t.assignedTo?.name || 'N/A'}</b>
                        </span>
                        <span>
                          Remark: <b>{t.remark || 'No remark'}</b>
                        </span>
                      </div>
                    </div>

                    <div className="list-item-actions">
                      <StatusBadge status={t.status} />
                      <button
                        onClick={() => handleDeleteTask(t._id)}
                        className="btn btn-danger btn-sm btn-icon"
                        title="Delete task"
                      >
                        <IconTrash />
                      </button>
                    </div>
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
