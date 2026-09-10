import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    api.get('/api/auth/me')
      .then(res=>setUser(res.data))
      .catch(()=>setUser(null))
      .finally(()=>setLoading(false));
  },[]);

  const login = (userData) => {
    setUser(userData); 
  };

  const logout = async () => {
    try{ await api.post('/api/auth/logout'); }catch(e){ }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}