
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/authSlice';

export default function Navbar(){
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <div style={{display:'flex', justifyContent:'space-between', padding:'10px 20px', background:'#222', color:'white'}}>
      <b>Task Manager | {user?.role?.toUpperCase()}</b>
      <div style={{display:'flex', alignItems:'center', gap:15}}>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <Link to="/reports" style={{color:'green', textDecoration:'none', display:'inline-block'}}>Reports</Link>
        )}
        <span>{user?.name}</span>
        <button onClick={()=>dispatch(logoutUser())} style={{background:'red', color:'white', border:'none', padding:'5px 12px', cursor:'pointer'}}>Logout</button>
      </div>
    </div>
  )
}