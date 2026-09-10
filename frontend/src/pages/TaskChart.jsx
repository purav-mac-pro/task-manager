import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { fetchTasks, fetchEmployees } from '../redux/tasksSlice';

const STATUS_COLORS = {
  completed: '#22c55e',
  'in-progress': '#f59e0b',
  pending: '#ef4444',
};

export default function TaskChart(){
  const dispatch = useDispatch();
  const { items: tasks, employees, loading } = useSelector(state => state.tasks);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(()=>{
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  },[dispatch]);

  const filteredTasks = useMemo(()=>{
    if(!selectedEmployee) return tasks;
    return tasks.filter(t => t.assignedTo?._id === selectedEmployee);
  },[tasks, selectedEmployee]);

  const chartData = useMemo(()=>{
    const counts = { completed: 0, 'in-progress': 0, pending: 0 };
    filteredTasks.forEach(t=>{
      const status = t.status || 'pending';
      if(counts[status] !== undefined) counts[status]++;
      else counts.pending++;
    });
    return [
      { name: 'Completed', key: 'completed', count: counts.completed },
      { name: 'In Progress', key: 'in-progress', count: counts['in-progress'] },
      { name: 'Pending', key: 'pending', count: counts.pending },
    ];
  },[filteredTasks]);

  const total = filteredTasks.length;

  if(loading) return <div style={{padding:20, textAlign:'center'}}>Please wait. Loading...</div>;

  return (
    <div style={{padding:20, background:'#f5f5f5', minHeight:'100vh'}}>
      <h2 style={{textAlign:'center'}}>Task Report</h2>

      <div style={{display:'flex', justifyContent:'center', marginBottom:24}}>
        <select
          value={selectedEmployee}
          onChange={e=>setSelectedEmployee(e.target.value)}
          style={{padding:10, borderRadius:6, border:'1px solid #ccc', minWidth:260}}
        >
          <option value=""> All Employees </option>
          {employees.map(emp=>(
            <option key={emp._id} value={emp._id}>{emp.name} - {emp.email}</option>
          ))}
        </select>
      </div>

      <div style={{maxWidth:700, margin:'0 auto', background:'#fff', borderRadius:12, padding:20, boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
        <p style={{textAlign:'center', color:'#666', marginTop:0}}>
          {selectedEmployee
            ? `Showing ${total} task for ${employees.find(e=>e._id===selectedEmployee)?.name || ''}`
            : `Showing ${total} task for All Employees`}
        </p>

        {total === 0 ? (
          <p style={{textAlign:'center', color:'#999'}}>No tasks found.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Tasks" radius={[6,6,0,0]}>
                {chartData.map(entry => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:16, fontSize:13}}>
          <span><span style={{display:'inline-block', width:10, height:10, background:STATUS_COLORS.completed, borderRadius:2, marginRight:6}}></span>Completed: {chartData[0].count}</span>
          <span><span style={{display:'inline-block', width:10, height:10, background:STATUS_COLORS['in-progress'], borderRadius:2, marginRight:6}}></span>In Progress: {chartData[1].count}</span>
          <span><span style={{display:'inline-block', width:10, height:10, background:STATUS_COLORS.pending, borderRadius:2, marginRight:6}}></span>Pending: {chartData[2].count}</span>
        </div>
      </div>
    </div>
  )
}