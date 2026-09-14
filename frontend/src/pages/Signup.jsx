import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/authSlice';
import { IconLogo } from '../components/icons';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await dispatch(registerUser(form));
    setSubmitting(false);
    if (registerUser.fulfilled.match(result)) {
      navigate('/admin');
    } else {
      setError(result.payload || 'Failed to sign up');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">
          <IconLogo size={24} />
        </div>
        <h2 className="auth-heading">Admin Signup</h2>
        <p className="auth-subheading">Create the first administrator account</p>

        {error && <div className="form-error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Full Name</label>
            <input
              className="input"
              placeholder="Enter your Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 6 }}>
            {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
