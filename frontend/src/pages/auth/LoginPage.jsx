import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import api from '../../services/api';
import LoginRoleSwitcher from '../../components/auth/LoginRoleSwitcher';

const LoginPage = () => {
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    const target = user?.role === 'Student' ? '/student/dashboard' : user?.role === 'Teacher' ? '/teacher' : user?.role === 'SuperAdmin' ? '/superadmin' : '/admin';
    return <Navigate to={target} replace />;
  }

  const isStudent = role === 'Student';
  const emailError = !isStudent && email && !isValidEmail(email) ? 'Please enter a valid email address.' : '';
  const passwordError = !isStudent && password && !isValidPassword(password) ? 'Password must be at least 6 characters.' : '';
  const isFormValid = email.trim() && password.trim() && (isStudent || (!emailError && !passwordError));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password: password.trim(), role });
      const { user: userData, token } = response.data;
      login(userData, token);
      const target = userData.role === 'Student' ? '/student/dashboard' : userData.role === 'Teacher' ? '/teacher' : userData.role === 'SuperAdmin' ? '/superadmin' : '/admin';
      navigate(target);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-bg-dark px-4 py-8">
      <div className="w-full max-w-md bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-5">
          <img src="/logo.png" alt="Elite Edu" className="w-14 h-14 object-contain mb-2 drop-shadow-md" />
          <h1 className="text-xl font-black text-ink dark:text-ink-dark">Elite Educational ERP</h1>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark mt-0.5">
            {isStudent ? 'Student & Parent Access Portal' : role === 'Teacher' ? 'Faculty & Staff Sign In' : 'Institutional Admin Sign In'}
          </p>
        </div>

        <LoginRoleSwitcher activeRole={role} onSelectRole={(r) => { setRole(r); setError(''); }} />

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-bad-soft text-bad flex items-center gap-2 text-xs border border-bad/20 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              {isStudent ? 'GR Number / Email / Phone' : 'Work email'}
            </label>
            <input
              type={isStudent ? 'text' : 'email'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isStudent ? 'e.g. GR-1024 or 03001234567' : 'name@school.edu'}
              className="w-full px-3.5 py-2.5 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {emailError && <p className="text-bad text-[10px] mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isStudent ? 'Default: Your GR Number' : 'Enter password'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-line dark:border-line-dark bg-white dark:bg-surface-secondary-dark text-ink dark:text-ink-dark text-xs font-medium focus:outline-none focus:ring-2 pr-10 focus:ring-primary/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {passwordError && <p className="text-bad text-[10px] mt-1">{passwordError}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs transition-all disabled:opacity-50 mt-2 shadow-md shadow-primary/20 cursor-pointer"
          >
            {loading ? 'Authenticating...' : `Sign in as ${role}`}
          </button>
        </form>

        <div className="mt-5 text-center text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium">
          EliteEdu
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
