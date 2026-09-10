
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchEmployees, createTask } from '../redux/tasksSlice';

export default function ManagerDashboard(){
  const dispatch = useDispatch();
  const { items: tasks, employees } = useSelector(state => state.tasks);
  const [form, setForm] = useState({ title:'', description:'', assignedTo:'' });

  useEffect(()=>{
    dispatch(fetchEmployees());
    dispatch(fetchTasks());
  },[dispatch]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if(!form.assignedTo) return alert('Please select the Employee');
    const result = await dispatch(createTask(form));
    if(createTask.fulfilled.match(result)){
      alert('Task Assigned to Employee');
      setForm({ title:'', description:'', assignedTo:'' });
    } else {
      alert(result.payload || 'Failed to assign task');
    }
  };

  return (
    <div style={{padding:20, background:'#f5f5f5', minHeight:'100vh'}}>
      <h2 style={{textAlign:'center'}}>Manager Dashboard</h2>
      <div style={{width:'100%', display:'flex', justifyContent:'center', marginBottom:30}}>
        <form onSubmit={handleCreateTask} style={{border:'1px solid #ccc', padding:20, background:'#fff', borderRadius:12, width:'100%', maxWidth:420}}>
          <h4 style={{textAlign:'center'}}>Create Task for Employee</h4>
          <input style={{width:'100%', padding:10, margin:'8px 0'}} placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <textarea style={{width:'100%', padding:10, margin:'8px 0'}} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
          <select style={{width:'100%', padding:10, margin:'8px 0'}} value={form.assignedTo} onChange={e=>setForm({...form, assignedTo:e.target.value})} required>
            <option value="">-- Select the Employee --</option>
            {employees.map(emp=>(
              <option key={emp._id} value={emp._id}>{emp.name} - {emp.email}</option>
            ))}
          </select>
          <button type="submit" style={{width:'100%', padding:12, background:'black', color:'white', borderRadius:6}}>Assign to Employee</button>
        </form>
      </div>
      <p style={{textAlign:'center', fontSize:12}}>Found {employees.length} employees</p>
      <h3 style={{textAlign:'center'}}>All Tasks ({tasks.length})</h3>
      <div style={{maxWidth:800, margin:'0 auto'}}>
        {tasks.map(t=>(
          <div key={t._id} style={{border:'1px solid #ddd', padding:12, marginBottom:10, background:'#fff', borderRadius:8}}>
            <b>{t.title}</b> - {t.status}
            <p>To: {t.assignedTo?.name}{t.remark ? ` | ${t.remark}` : ''}</p>
          </div>
        ))}
      </div>
    </div>
  )
}