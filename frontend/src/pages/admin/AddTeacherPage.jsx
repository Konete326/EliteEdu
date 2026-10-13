import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { isValidEmail } from '../../utils/validators';

const AddTeacherPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isEmailValid = !email || isValidEmail(email);
  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && isValidEmail(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setLoading(true);

    try {
      await api.post('/teachers', { name: name.trim(), email: email.toLowerCase().trim() });
      navigate('/admin/teachers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Onboard Teacher</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Register a new faculty member to your institution.</p>
        </div>
        <Link
          to="/admin/teachers"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider mb-2">
            Teacher Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Dr. Ayesha Khan"
            className="w-full px-4 py-2.5 rounded-lg border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark uppercase tracking-wider mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. ayesha.khan@school.edu"
            className={`w-full px-4 py-2.5 rounded-lg border bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm ${
              !isEmailValid ? 'border-bad focus:border-bad' : 'border-line dark:border-line-dark focus:border-primary'
            }`}
          />
          {!isEmailValid && (
            <p className="mt-1.5 text-xs text-bad">Please enter a valid email address.</p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors disabled:opacity-50 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Adding Teacher...' : 'Add Teacher'}</span>
          </button>
          <Link to="/admin/teachers" className="text-sm text-ink-muted hover:text-ink dark:hover:text-ink-dark font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddTeacherPage;
