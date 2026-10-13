import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { isValidEmail, isValidPassword, isValidPhone, isValidCode } from '../../utils/validators';
import SchoolInfoForm from '../../components/superadmin/SchoolInfoForm';
import AdminInfoForm from '../../components/superadmin/AdminInfoForm';

const initialSchool = { name: '', code: '', school_type: 'Private', board: '', address: '', contact_number: '', email: '' };
const initialAdmin = { name: '', email: '', password: '' };

const SchoolsPage = () => {
  const [school, setSchool] = useState(initialSchool);
  const [admin, setAdmin] = useState(initialAdmin);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const errors = {
    code: school.code && !isValidCode(school.code) ? 'Code must be 2-10 alphanumeric characters.' : '',
    contact: school.contact_number && !isValidPhone(school.contact_number) ? 'Invalid phone format.' : '',
    email: school.email && !isValidEmail(school.email) ? 'Invalid official email.' : '',
    adminEmail: admin.email && !isValidEmail(admin.email) ? 'Invalid admin email.' : '',
    adminPassword: admin.password && !isValidPassword(admin.password) ? 'Password must be at least 6 characters.' : ''
  };

  const isFormValid =
    school.name &&
    school.code &&
    admin.name &&
    admin.email &&
    admin.password &&
    !Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('/schools', { schoolData: school, adminData: admin });
      setSuccess(`School "${res.data.school.name}" and Admin account registered successfully.`);
      setSchool(initialSchool);
      setAdmin(initialAdmin);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register school.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Register New School</h1>
          <p className="text-sm text-ink-muted dark:text-ink-muted-dark">Onboard an educational institution and its primary administrator.</p>
        </div>
        <Link
          to="/superadmin/schools"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-good-soft dark:bg-good/10 text-good border border-good/20 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-bad-soft dark:bg-bad/10 text-bad border border-bad/20 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SchoolInfoForm school={school} setSchool={setSchool} errors={errors} />
        <AdminInfoForm admin={admin} setAdmin={setAdmin} errors={errors} />

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium text-sm transition-colors disabled:opacity-50 shadow-sm"
          >
            {loading ? 'Creating...' : 'Register School & Principal'}
          </button>
          <Link to="/superadmin/schools" className="text-sm text-ink-muted hover:text-ink dark:hover:text-ink-dark font-medium">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SchoolsPage;
