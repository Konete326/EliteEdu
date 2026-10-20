import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isValidEmail } from '../../utils/validators';
import api from '../../services/api';
import LoginHeader from '../../components/auth/LoginHeader';
import LoginRoleSwitcher from '../../components/auth/LoginRoleSwitcher';
import LoginFormFields from '../../components/auth/LoginFormFields';

const LoginPage = () => {
  const [role, setRole] = useState('Admin');
  const [identifier, setIdentifier] = useState('');
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
  const cleanId = identifier.trim();
  const hasEmailFormat = cleanId.includes('@');
  const idError = hasEmailFormat && !isValidEmail(cleanId) ? 'Please enter a valid email address.' : '';
  const isFormValid = cleanId.length > 0 && password.trim().length > 0 && !idError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || loading) return;
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        identifier: cleanId,
        email: cleanId,
        password: password.trim(),
        role
      });
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
    <div className="min-h-[100dvh] flex items-center justify-center bg-bg dark:bg-bg-dark px-3.5 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-[420px] bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm">
        <LoginHeader isStudent={isStudent} role={role} />
        <LoginRoleSwitcher activeRole={role} onSelectRole={(r) => { setRole(r); setError(''); }} />

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-bad-soft text-bad flex items-center gap-2 text-xs border border-bad/20 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <LoginFormFields
            role={role}
            isStudent={isStudent}
            identifier={identifier}
            setIdentifier={setIdentifier}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            idError={idError}
          />

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full py-3 sm:py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold text-xs tracking-wide transition-all disabled:opacity-50 mt-2 shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign in as {role}</span>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium">
          Elite Educational System · Secure Gateway
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
