
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, fetchAdminUsers, createTask, createUser, deleteTask } from '../redux/tasksSlice';

export default function AdminDashboard(){
  const dispatch = useDispatch();
  const { items: tasks, adminUsers: users } = useSelector(state => state.tasks);

  const [form, setForm] = useState({ title:'', description:'', assignedTo:'' });
  const [userForm, setUserForm] = useState({ name:'', email:'', password:'', role:'employee' });

  useEffect(()=>{
    dispatch(fetchAdminUsers());
    dispatch(fetchTasks());
  },[dispatch]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const result = await dispatch(createUser(userForm));
    if(createUser.fulfilled.match(result)){
      alert('User created successfully.');
      setUserForm({ name:'', email:'', password:'', role:'employee' });
    } else {
      alert(result.payload || 'Failed to create user');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if(!form.assignedTo) return alert('Please select the User');
    const result = await dispatch(createTask(form));
    if(createTask.fulfilled.match(result)){
      alert('Task Added');
      setForm({ title:'', description:'', assignedTo:'' });
    } else {
      alert(result.payload || 'Failed to add task');
    }
  };

  const handleDeleteTask = (id) => {
    if(!window.confirm('Delete this task?')) return;
    dispatch(deleteTask(id));
  };

  const cardStyle = { border:'1px solid #ccc', padding:20, background:'#fff', borderRadius:12, width:'100%', maxWidth:380, boxShadow:'0 4px 12px rgba(0,0,0,0.08)' };
  const inputStyle = { width:'100%', padding:10, margin:'8px 0', borderRadius:6, border:'1px solid #ccc', boxSizing:'border-box' };

  return (
  <div style={{padding:20, background:'#f5f5f5', minHeight:'100vh'}}>
    <h2 style={{textAlign:'center'}}>Admin Dashboard</h2>
    <div style={{width:'100%', display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap', alignItems:'flex-start', marginBottom:30}}>
      <form onSubmit={handleCreateUser} style={cardStyle}>
        <h4 style={{marginTop:0, textAlign:'center', color:'#666'}}>Add New User</h4>
        <input style={inputStyle} placeholder="Name" value={userForm.name} onChange={e=>setUserForm({...userForm, name:e.target.value})} required />
        <input style={inputStyle} placeholder="Email" type="email" value={userForm.email} onChange={e=>setUserForm({...userForm, email:e.target.value})} required />
        <input style={inputStyle} placeholder="Password" type="password" value={userForm.password} onChange={e=>setUserForm({...userForm, password:e.target.value})} required />
        <select style={inputStyle} value={userForm.role} onChange={e=>setUserForm({...userForm, role:e.target.value})}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" style={{width:'100%', padding:12, background:'#222', color:'white', borderRadius:6, cursor:'pointer', marginTop:8}}>Create User</button>
      </form>

      <form onSubmit={handleCreateTask} style={cardStyle}>
        <h4 style={{marginTop:0, textAlign:'center', color:'#666'}}>Add New Task</h4>
        <input style={inputStyle} placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
        <textarea style={{...inputStyle, minHeight:80}} placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        <select style={inputStyle} value={form.assignedTo} onChange={e=>setForm({...form, assignedTo:e.target.value})} required>
          <option value="">-- Select User --</option>
          {users.filter(u=>u.role !== 'admin' ).map(u=>(
            <option key={u._id} value={u._id}>{u.name} - {u.role} ({u.email})</option>
          ))}
        </select>
        <button type="submit" style={{width:'100%', padding:12, background:'black', color:'white', borderRadius:6, cursor:'pointer', marginTop:8}}>Add Task</button>
      </form>
    </div>

    <h3 style={{textAlign:'center', marginTop:30}}>All Tasks ({tasks.length})</h3>
    <div style={{maxWidth:800, margin:'0 auto'}}>
    {tasks.map(t=>(
        <div key={t._id} style={{border:'1px solid #ddd', padding:12, marginBottom:10, background:'#fff', borderRadius:8}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <b>{t.title}</b>
            <div style={{display:'flex', gap:8, alignItems:'center'}}>
              <span style={{fontSize:11, background:'#eee', padding:'2px 8px', borderRadius:10}}>{t.status}</span>
              <button onClick={()=>handleDeleteTask(t._id)} style={{background:'#ff4d4d', color:'white', border:'none', padding:'4px 10px', borderRadius:4, cursor:'pointer', fontSize:12}}>Delete</button>
            </div>
          </div>
          <p style={{margin:'6px 0', fontSize:14}}>{t.description}</p>
          <p style={{margin:'4px 0', fontSize:13}}>To: <b>{t.assignedTo?.name || 'N/A'}</b> | Remark: {t.remark || 'No remark'}</p>
        </div>
      ))}
    </div>
  </div>
  )
}