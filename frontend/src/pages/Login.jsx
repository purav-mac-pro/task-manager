import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/authSlice';
import { IconLogo, IconMail, IconLock } from '../components/icons';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: apiError } = useSelector((state) => state.auth);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (field === 'email') {
      if (value && !emailRegex.test(value)) setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
      else setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (errors.email) return;
    setSubmitting(true);
    const result = await dispatch(loginUser(form));
    setSubmitting(false);
    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'manager') navigate('/manager');
      else navigate('/employee');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <IconLogo size={24} />
        </div>
        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-subheading">Sign in to manage your tasks</p>

        {apiError && <div className="form-error-banner">{apiError}</div>}

        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                style={{ paddingLeft: 38 }}
                type="email"
                placeholder="Enter your email"
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
              <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }}>
                <IconMail size={16} />
              </span>
            </div>
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                style={{ paddingLeft: 38 }}
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <span style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }}>
                <IconLock size={16} />
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 6 }}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Need an admin account? <Link to="/signup">Admin Signup</Link>
        </p>
      </div>
    </div>
  );
}
