
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../redux/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';

  const linkStyle = (path) => ({
    color: location.pathname === path ? '#fff' : '#bbb',
    textDecoration: 'none',
    padding: '8px 12px',
    borderRadius: 6,
    background:
      location.pathname === path ? '#444' : 'transparent',
    fontWeight: 500,
  });

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#222',
        color: 'white',
        gap: 20,
        flexWrap: 'wrap',
      }}
    >
      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        
        <Link
          to={isAdmin ? '/admin' : `/${user?.role}`}
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Task Manager
        </Link>

        
        <span style={{ color: '#777' }}>|</span>

        
        <span
          style={{
            color: '#bbb',
            padding: '8px 4px',
            fontWeight: 500,
            textTransform: 'capitalize',
          }}
        >
          {user?.role}
        </span>

        
        {isAdmin && (
          <>
            <span style={{ color: '#777' }}>|</span>

            <Link
              to="/admin/roles"
              style={linkStyle('/admin/roles')}
            >
              Manage Roles
            </Link>

            <Link
              to="/admin/users"
              style={linkStyle('/admin/users')}
            >
              Manage Users
            </Link>
          </>
        )}

        
        {(isAdmin || user?.role === 'manager') && (
          <Link
            to="/reports"
            style={linkStyle('/reports')}
          >
            Reports
          </Link>
        )}
      </div>

      
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ color: '#ddd' }}>
          {user?.name}
        </span>

        <button
          onClick={() => dispatch(logoutUser())}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '7px 14px',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
