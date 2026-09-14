import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchEmployees, createTask } from '../redux/tasksSlice';
import { IconPlus, IconInbox } from '../components/icons';
import StatusBadge from '../components/StatusBadge';

export default function ManagerDashboard() {
  const dispatch = useDispatch();
  const { items: tasks, employees } = useSelector((state) => state.tasks);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.assignedTo) return alert('Please select the Employee');

    setSubmitting(true);
    const result = await dispatch(createTask(form));
    setSubmitting(false);

    if (createTask.fulfilled.match(result)) {
      setForm({ title: '', description: '', assignedTo: '' });
    } else {
      alert(result.payload || 'Failed to assign task');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Team</p>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="page-subtitle">Assign work to your team and track progress.</p>
        </div>
      </div>

      <div className="container">
        <div className="stat-row">
          <div className="stat-chip">
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Employees</div>
          </div>
          <div className="stat-chip accent-primary">
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="card card-pad">
            <div className="card-title-row" style={{ marginBottom: 18 }}>
              <span className="card-icon">
                <IconPlus size={18} />
              </span>
              <h3>Create Task for Employee</h3>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="field">
                <label className="label">Title</label>
                <input
                  className="input"
                  placeholder="Task title"
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
                  <option value="">-- Select the Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} - {emp.email}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 4 }}>
                {submitting ? 'Assigning...' : 'Assign to Employee'}
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
                <p>Assign your first task using the form.</p>
              </div>
            ) : (
              <div className="list">
                {tasks.map((t) => (
                  <div key={t._id} className="list-item">
                    <div className="list-item-main">
                      <div className="list-item-title">{t.title}</div>
                      <div className="list-item-meta">
                        <span>
                          To <b>{t.assignedTo?.name}</b>
                        </span>
                        {t.remark && (
                          <span>
                            Remark: <b>{t.remark}</b>
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
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
