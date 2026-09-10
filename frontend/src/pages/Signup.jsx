
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if(registerUser.fulfilled.match(result)){
      navigate('/admin');
    } else {
      alert(result.payload);
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f5f5f5'}}>
      <form onSubmit={handleSubmit} style={{background:'#fff', padding:25, borderRadius:10, width:350, textAlign:'center'}}>
        <h3>Admin Signup Only</h3>
        <input style={{width:'80%', padding:10, margin:'8px 0'}} placeholder="Enter Name" onChange={e=>setForm({...form, name:e.target.value})} required />
        <input style={{width:'80%', padding:10, margin:'8px 0'}} type="email" placeholder="Enter Email" onChange={e=>setForm({...form, email:e.target.value})} required />
        <input style={{width:'80%', padding:10, margin:'8px 0'}} type="password" placeholder="Enter Password" onChange={e=>setForm({...form, password:e.target.value})} required />
        <button type="submit" style={{width:'60%', padding:10, background:'black', color:'white', borderRadius:6}}>SignUp</button>
        <p style={{textAlign:'center', marginTop:15, fontSize:'13px'}}><Link to="/login">Login</Link></p>
      </form>
    </div>
  )
}