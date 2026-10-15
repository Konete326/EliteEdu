import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import api from '../../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailError = email && !isValidEmail(email) ? 'Please enter a valid email address.' : '';
  const passwordError = password && !isValidPassword(password) ? 'Password must be at least 6 characters.' : '';
  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      login(user, token);

      if (user.role === 'SuperAdmin') navigate('/superadmin');
      else if (user.role === 'Admin') navigate('/admin');
      else if (user.role === 'Teacher') navigate('/teacher');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark px-4 py-8">
      <div className="w-full max-w-md bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/logo.png" alt="Elite Edu" className="w-16 h-16 object-contain mb-3 drop-shadow-md" />
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Staff sign-in</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark mt-1">Access your school management portal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-bad-soft text-bad flex items-center gap-2 text-sm border border-bad/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Work email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@school.edu"
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 ${
                emailError
                  ? 'border-bad focus:ring-bad/20 focus:border-bad'
                  : 'border-line dark:border-line-dark focus:ring-primary/20 focus:border-primary'
              }`}
            />
            {emailError && <p className="text-bad text-xs mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-sm focus:outline-none focus:ring-2 pr-10 ${passwordError ? 'border-bad focus:ring-bad/20' : 'border-line dark:border-line-dark focus:ring-primary/20'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && <p className="text-bad text-xs mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full py-2.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors duration-200 disabled:opacity-50 mt-2 shadow-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink-muted dark:text-ink-muted-dark">
          EliteEdu School Management System
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
