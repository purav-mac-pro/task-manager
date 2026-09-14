import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCurrentUser } from './redux/authSlice';

import Navbar from './components/Navbar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import ManageRoles from './pages/ManageRoles';
import ManageUsers from './pages/ManageUsers';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import TaskChart from './pages/TaskChart';

function Protected({ children, allowed }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="loading-shell">
        <div className="spinner" />
        Please wait, loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <Protected allowed={['admin']}>
              <AdminDashboard />
            </Protected>
          }
        />

        {/* ADMIN - MANAGE ROLES */}
        <Route
          path="/admin/roles"
          element={
            <Protected allowed={['admin']}>
              <ManageRoles />
            </Protected>
          }
        />

        {/* ADMIN - MANAGE USERS */}
        <Route
          path="/admin/users"
          element={
            <Protected allowed={['admin']}>
              <ManageUsers />
            </Protected>
          }
        />

        {/* MANAGER */}
        <Route
          path="/manager"
          element={
            <Protected allowed={['manager']}>
              <ManagerDashboard />
            </Protected>
          }
        />

        {/* EMPLOYEE */}
        <Route
          path="/employee"
          element={
            <Protected allowed={['employee']}>
              <EmployeeDashboard />
            </Protected>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <Protected allowed={['admin', 'manager']}>
              <TaskChart />
            </Protected>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}