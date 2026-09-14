import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchTasks, fetchEmployees } from '../redux/tasksSlice';
import { IconChart } from '../components/icons';

const STATUS_COLORS = {
  completed: '#16a34a',
  'in-progress': '#2563eb',
  pending: '#d97706',
};

export default function TaskChart() {
  const dispatch = useDispatch();
  const { items: tasks, employees, loading } = useSelector((state) => state.tasks);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  }, [dispatch]);

  const filteredTasks = useMemo(() => {
    if (!selectedEmployee) return tasks;
    return tasks.filter((t) => t.assignedTo?._id === selectedEmployee);
  }, [tasks, selectedEmployee]);

  const chartData = useMemo(() => {
    const counts = { completed: 0, 'in-progress': 0, pending: 0 };
    filteredTasks.forEach((t) => {
      const status = t.status || 'pending';
      if (counts[status] !== undefined) counts[status]++;
      else counts.pending++;
    });
    return [
      { name: 'Completed', key: 'completed', count: counts.completed },
      { name: 'In Progress', key: 'in-progress', count: counts['in-progress'] },
      { name: 'Pending', key: 'pending', count: counts.pending },
    ];
  }, [filteredTasks]);

  const total = filteredTasks.length;

  if (loading) {
    return (
      <div className="loading-shell">
        <div className="spinner" />
        Please wait, loading...
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Insights</p>
          <h1 className="page-title">Task Report</h1>
          <p className="page-subtitle">Breakdown of task status across your team.</p>
        </div>
      </div>

      <div className="container-narrow">
        <div className="field" style={{ maxWidth: 340, margin: '0 auto 20px' }}>
          <select
            className="select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} - {emp.email}
              </option>
            ))}
          </select>
        </div>

        <div className="card card-pad">
          <div className="card-title-row" style={{ marginBottom: 4 }}>
            <span className="card-icon">
              <IconChart size={18} />
            </span>
            <div>
              <h3 style={{ marginBottom: 2 }}>
                {selectedEmployee
                  ? employees.find((e) => e._id === selectedEmployee)?.name || ''
                  : 'All Employees'}
              </h3>
              <p className="text-muted" style={{ fontSize: 13 }}>{total} task{total === 1 ? '' : 's'} total</p>
            </div>
          </div>

          {total === 0 ? (
            <p className="text-center text-muted" style={{ padding: '32px 0' }}>No tasks found.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 16, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border-soft)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--surface-muted)' }}
                  contentStyle={{ borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}
                />
                <Bar dataKey="count" name="Tasks" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 18, fontSize: 13, flexWrap: 'wrap' }}>
            <span><span className="legend-dot" style={{ background: STATUS_COLORS.completed }} />Completed: {chartData[0].count}</span>
            <span><span className="legend-dot" style={{ background: STATUS_COLORS['in-progress'] }} />In Progress: {chartData[1].count}</span>
            <span><span className="legend-dot" style={{ background: STATUS_COLORS.pending }} />Pending: {chartData[2].count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
