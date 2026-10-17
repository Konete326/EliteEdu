import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { getApiBase } from '../../../utils/apiBase';

const UserFormModal = ({ user, roles = [], campuses = [], token, onClose, onSaved }) => {
  const isEdit = Boolean(user?._id);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contact_number: user?.contact_number || '',
    role: user?.role || 'Teacher',
    custom_role_id: user?.custom_role_id?._id || user?.custom_role_id || '',
    campus_id: user?.campus_id?._id || user?.campus_id || '',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Name is required');
    if (!isEdit && !formData.password) return setError('Password is required');
    setSubmitting(true);
    setError('');

    try {
      const url = isEdit
        ? `${getApiBase()}/user-management/users/${user._id}`
        : `${getApiBase()}/user-management/users`;
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');
      onSaved(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line dark:border-line-dark">
          <h3 className="text-base font-bold text-ink dark:text-ink-dark">
            {isEdit ? 'Edit User Details' : 'Add New User'}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg text-ink-muted hover:text-ink cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="p-6 space-y-4 text-xs">
          {error && <div className="p-2.5 bg-bad/10 border border-bad/20 rounded-xl text-bad text-xs font-medium">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Full Name *</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Phone Number</label>
              <input type="text" value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Primary Role</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary">
                <option value="Teacher">Teacher / Faculty</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Custom Role</label>
              <select value={formData.custom_role_id} onChange={(e) => setFormData({ ...formData, custom_role_id: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary">
                <option value="">None (Standard)</option>
                {roles.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
              </select>
            </div>
            <div className={isEdit ? 'col-span-2' : ''}>
              <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Campus</label>
              <select value={formData.campus_id} onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary">
                <option value="">All / Main Campus</option>
                {campuses.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {!isEdit && (
              <div>
                <label className="block font-semibold text-ink dark:text-ink-dark mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full pl-3 pr-10 py-2 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary text-xs"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-line dark:border-line-dark">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-line text-ink cursor-pointer">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded-xl bg-primary text-white font-semibold cursor-pointer disabled:opacity-50">
              {submitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
