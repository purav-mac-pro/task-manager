import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchTasks,
  fetchAdminUsers,
  createTask,
  deleteTask,
} from '../redux/tasksSlice';

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const {
    items: tasks,
    adminUsers: users,
  } = useSelector((state) => state.tasks);

  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
  });

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

    const result = await dispatch(createTask(form));

    if (createTask.fulfilled.match(result)) {
      alert('Task Added');

      setForm({
        title: '',
        description: '',
        assignedTo: '',
      });
    } else {
      alert(result.payload || 'Failed to add task');
    }
  };

  const handleDeleteTask = (id) => {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    dispatch(deleteTask(id));
  };

  const cardStyle = {
    border: '1px solid #ccc',
    padding: 20,
    background: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    boxSizing: 'border-box',
  };

  const inputStyle = {
    width: '100%',
    padding: 10,
    margin: '8px 0',
    borderRadius: 6,
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        padding: 20,
        background: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>
        Admin Dashboard
      </h2>

      
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 35,
        }}
      >
        <form
          onSubmit={handleCreateTask}
          style={cardStyle}
        >
          <h3
            style={{
              marginTop: 0,
              textAlign: 'center',
            }}
          >
            Add New Task
          </h3>

          <input
            style={inputStyle}
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
          />

          <textarea
            style={{
              ...inputStyle,
              minHeight: 100,
              resize: 'vertical',
            }}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <select
            style={inputStyle}
            value={form.assignedTo}
            onChange={(e) =>
              setForm({
                ...form,
                assignedTo: e.target.value,
              })
            }
            required
          >
            <option value="">
              -- Select User --
            </option>

            {users
              .filter((u) => u.role !== 'admin')
              .map((u) => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name} - {u.role} ({u.email})
                </option>
              ))}
          </select>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: 12,
              background: '#222',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            Add Task
          </button>
        </form>
      </div>

      
      <h3
        style={{
          textAlign: 'center',
          marginTop: 30,
        }}
      >
        All Tasks ({tasks.length})
      </h3>

      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        {tasks.length === 0 ? (
          <div
            style={{
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              color: '#777',
            }}
          >
            No tasks found.
          </div>
        ) : (
          tasks.map((t) => (
            <div
              key={t._id}
              style={{
                border: '1px solid #ddd',
                padding: 15,
                marginBottom: 10,
                background: '#fff',
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <b>{t.title}</b>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      background: '#eee',
                      padding: '3px 8px',
                      borderRadius: 10,
                    }}
                  >
                    {t.status}
                  </span>

                  <button
                    onClick={() =>
                      handleDeleteTask(t._id)
                    }
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: 5,
                      cursor: 'pointer',
                      fontSize: 12,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p
                style={{
                  margin: '8px 0',
                  fontSize: 14,
                }}
              >
                {t.description || 'No description'}
              </p>

              <p
                style={{
                  margin: '5px 0',
                  fontSize: 13,
                  color: '#555',
                }}
              >
                Assigned to:{' '}
                <b>
                  {t.assignedTo?.name || 'N/A'}
                </b>
              </p>

              <p
                style={{
                  margin: '5px 0',
                  fontSize: 13,
                  color: '#555',
                }}
              >
                Remark:{' '}
                {t.remark || 'No remark'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}