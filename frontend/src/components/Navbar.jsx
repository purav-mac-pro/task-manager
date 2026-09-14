import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../redux/authSlice';
import { IconLogo, IconLogout } from './icons';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  const initials = (user?.name || '?')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navClass = (path) =>
    `nav-link${location.pathname === path ? ' active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={isAdmin ? '/admin' : `/${user?.role}`} className="navbar-brand">
          <span className="navbar-logo">
            <IconLogo size={17} />
          </span>
          Task Manager
        </Link>

        <span className="navbar-divider" />

        <span className="navbar-role-tag">{user?.role}</span>

        {isAdmin && (
          <>
            <Link to="/admin/roles" className={navClass('/admin/roles')}>
              Manage Roles
            </Link>
            <Link to="/admin/users" className={navClass('/admin/users')}>
              Manage Users
            </Link>
          </>
        )}

        {(isAdmin || isManager) && (
          <Link to="/reports" className={navClass('/reports')}>
            Reports
          </Link>
        )}
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <span className="avatar avatar-sm">{initials}</span>
          <span className="navbar-user-name">{user?.name}</span>
        </div>

        <button onClick={() => dispatch(logoutUser())} className="btn btn-secondary btn-sm">
          <IconLogout size={14} />
          Logout
        </button>
      </div>
    </nav>
  );
}
