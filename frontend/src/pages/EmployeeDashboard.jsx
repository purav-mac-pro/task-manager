import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask } from '../redux/tasksSlice';
import { IconInbox } from '../components/icons';
import StatusBadge from '../components/StatusBadge';

export default function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { items: tasks } = useSelector((state) => state.tasks);
  const [remarks, setRemarks] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleUpdate = async (id, status) => {
    setSavingId(id);
    await dispatch(updateTask({ id, data: { status, remark: remarks[id] ?? '' } }));
    setSavingId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Your Work</p>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Update the status and leave a remark as you make progress.</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="card-header">
            <h3>Assigned Tasks ({tasks.length})</h3>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <IconInbox size={40} />
              </div>
              <p className="empty-state-title">No tasks assigned</p>
              <p>You're all caught up. Check back later.</p>
            </div>
          ) : (
            <div className="list">
              {tasks.map((t) => (
                <div key={t._id} className="list-item" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div className="list-item-main" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span className="list-item-title">{t.title}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="list-item-desc">{t.description || 'No description'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <select
                      className="select"
                      style={{ maxWidth: 180 }}
                      value={t.status}
                      onChange={(e) => handleUpdate(t._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <input
                      className="input"
                      style={{ maxWidth: 260 }}
                      placeholder="Add a remark..."
                      value={remarks[t._id] ?? t.remark ?? ''}
                      onChange={(e) => setRemarks({ ...remarks, [t._id]: e.target.value })}
                    />

                    <button
                      onClick={() => handleUpdate(t._id, t.status)}
                      className="btn btn-secondary btn-sm"
                      disabled={savingId === t._id}
                    >
                      {savingId === t._id ? 'Saving...' : 'Save Remark'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
