import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, updateTask } from '../redux/tasksSlice';

export default function EmployeeDashboard(){
  const dispatch = useDispatch();
  const { items: tasks } = useSelector(state => state.tasks);
  const [remarks, setRemarks] = useState({});

  useEffect(()=>{
    dispatch(fetchTasks());
  },[dispatch]);

  const handleUpdate = (id, status) => {
    dispatch(updateTask({ id, data: { status, remark: remarks[id] || '' } }));
  };

  return (
    <div style={{padding:20}}>
      <h2>Employee - My Tasks</h2>
      {tasks.map(t=>(
        <div key={t._id} style={{border:'1px solid #ddd', padding:12, marginBottom:10, background:'#fff'}}>
          <b>{t.title}</b> - {t.description}<br/>
          Status: <b>{t.status}</b><br/>
          <div style={{marginTop:8}}>
            <select value={t.status} onChange={e=>handleUpdate(t._id, e.target.value)} style={{padding:6, marginRight:10}}>
              <option value="pending">pending</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
            </select>
            <input placeholder="Remarks" value={remarks[t._id] || t.remark || ''} onChange={e=>setRemarks({...remarks, [t._id]: e.target.value})} style={{padding:6, width:200}} />
            <button onClick={()=>handleUpdate(t._id, t.status)} style={{marginLeft:8, padding:'6px 10px', background:'black', color:'white'}}>Save Remark</button>
          </div>
        </div>
      ))}
    </div>
  )
}