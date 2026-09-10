
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }){
  const { user, loading } = useSelector(state => state.auth);

  if(loading) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Please wait. Loading...</div>;

  if(!user) return <Navigate to="/login" replace />;

  if(allowedRoles && !allowedRoles.includes(user.role)){
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
}