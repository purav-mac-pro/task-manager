import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';

export default function Login(){
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: apiError } = useSelector(state => state.auth);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm({...form, [field]: value});
    if(field === 'email'){
      if(value &&!emailRegex.test(value)) setErrors(prev=>({...prev, email:'Invalid email'}));
      else setErrors(prev=>({...prev, email:''}));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(errors.email) return;
    const result = await dispatch(loginUser(form));
    if(loginUser.fulfilled.match(result)){
      const role = result.payload.user.role;
      if(role === 'admin') navigate('/admin');
      else if(role === 'manager') navigate('/manager');
      else navigate('/employee');
    }
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#f5f5f5'}}>
      <form onSubmit={handleLogin} style={{background:'#fff', padding:25, borderRadius:10, width:350, boxShadow:'0 4px 12px rgba(0,0,0,0.1)', textAlign:'center'}}>
        <h3 style={{textAlign:'center', marginTop:0}}>Login</h3>
        {apiError && <p style={{color:'red', fontSize:13, background:'#ffe6e6', padding:6, borderRadius:4}}>{apiError}</p>}

        <input
          style={{width:'80%', padding:10, margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}}
          type="email"
          placeholder="Enter your Email"
          onChange={e=>handleChange('email', e.target.value)}
          required
        />
        {errors.email && <p style={{color:'red', margin:0, fontSize:12}}>{errors.email}</p>}

        <input
          style={{width:'80%', padding:10, margin:'8px 0', borderRadius:6, border:'1px solid #ccc'}}
          type="password"
          placeholder="Enter your Password"
          onChange={e=>setForm({...form, password:e.target.value})}
          required
        />
        <button type="submit" style={{width:'40%', padding:10, background:'black', color:'white', borderRadius:6, marginTop:10, cursor:'pointer'}}>Login</button>
        <p style={{textAlign:'center', marginTop:15, fontSize:'13px'}}><Link to="/signup">Admin Signup</Link></p>
      </form>
    </div>
  )
}