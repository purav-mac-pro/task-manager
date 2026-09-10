import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/authSlice';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskChart from './pages/TaskChart';

function Protected({ children, allowed }){
  const { user, loading } = useSelector(state => state.auth);
  if(loading) return <div>Loading...</div>;
  if(!user) return <Navigate to="/login" replace />;
  if(allowed && !allowed.includes(user.role)) return <Navigate to={`/${user.role}`} replace />;
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App(){
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(fetchCurrentUser());
  },[dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<Protected allowed={['admin']}><AdminDashboard/></Protected>} />
        <Route path="/manager" element={<Protected allowed={['manager']}><ManagerDashboard/></Protected>} />
        <Route path="/employee" element={<Protected allowed={['employee']}><EmployeeDashboard/></Protected>} />
        <Route path="/reports" element={<Protected allowed={['admin','manager']}><TaskChart/></Protected>} />
      </Routes>
    </BrowserRouter>
  )
}