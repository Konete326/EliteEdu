import { Building2, Phone, Settings, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { validateEmail, validatePhone, getPasswordStrength } from '../../../utils/onboardingValidators';

const AdminOnboardingSteps = ({ step, form, onChange }) => {
  const isPhoneValid = !form.school_phone || validatePhone(form.school_phone);
  const isEmailValid = !form.school_email || validateEmail(form.school_email);
  const isAdminPhoneValid = !form.contact_number || validatePhone(form.contact_number);
  const passStrength = getPasswordStrength(form.new_password || '');
  const passMatch = !form.confirm_password || form.new_password === form.confirm_password;

  if (step === 1) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <Building2 className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">School Identity &amp; Branding</h4>
            <p className="text-[11px] text-ink-muted">General institutional name, board affiliation and branding marks</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Institution / School Name *
            </label>
            <input
              type="text"
              value={form.school_name || ''}
              onChange={(e) => onChange('school_name', e.target.value)}
              required
              placeholder="e.g. Elite Cambridge Grammar School"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              School Slogan / Tagline (Optional)
            </label>
            <input
              type="text"
              value={form.slogan || ''}
              onChange={(e) => onChange('slogan', e.target.value)}
              placeholder="e.g. Illuminating Minds, Inspiring Excellence"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Educational Board / Affiliation (Optional)
              </label>
              <input
                type="text"
                value={form.board || ''}
                onChange={(e) => onChange('board', e.target.value)}
                placeholder="e.g. BISE Karachi / Federal Board / Cambridge"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                School Logo URL (Optional)
              </label>
              <input
                type="url"
                value={form.logo_url || ''}
                onChange={(e) => onChange('logo_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <Phone className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Institutional Contact &amp; Location</h4>
            <p className="text-[11px] text-ink-muted">Official school communication channels displayed on challans and reports</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  Official Contact Phone
                </label>
                {form.school_phone && (
                  <span className={`text-[10px] font-bold ${isPhoneValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isPhoneValid ? 'Valid' : 'Invalid Format'}
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={form.school_phone || ''}
                onChange={(e) => onChange('school_phone', e.target.value)}
                placeholder="021-34567890 or 03001234567"
                className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                  form.school_phone && !isPhoneValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  Institutional Support Email
                </label>
                {form.school_email && (
                  <span className={`text-[10px] font-bold ${isEmailValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isEmailValid ? 'Valid Email' : 'Invalid Email'}
                  </span>
                )}
              </div>
              <input
                type="email"
                value={form.school_email || ''}
                onChange={(e) => onChange('school_email', e.target.value)}
                placeholder="info@school.edu.pk"
                className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                  form.school_email && !isEmailValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Campus Street Address (Optional)
            </label>
            <input
              type="text"
              value={form.school_address || ''}
              onChange={(e) => onChange('school_address', e.target.value)}
              placeholder="Plot / Sector / Street Address"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Operational Framework &amp; Academics</h4>
            <p className="text-[11px] text-ink-muted">Institutional categorization, fiscal currency and academic session</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Institutional Sector *
              </label>
              <select
                value={form.school_type || 'Private'}
                onChange={(e) => onChange('school_type', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Private">Private Educational Institution</option>
                <option value="Government">Government / Public Sector School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Academic Session Year
              </label>
              <input
                type="text"
                value={form.session || '2026-2027'}
                onChange={(e) => onChange('session', e.target.value)}
                placeholder="2026-2027"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Default Currency
              </label>
              <select
                value={form.currency || 'PKR'}
                onChange={(e) => onChange('currency', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="PKR">PKR (Pakistani Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Established Year (Optional)
              </label>
              <input
                type="text"
                value={form.established_year || ''}
                onChange={(e) => onChange('established_year', e.target.value)}
                placeholder="e.g. 2010"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <div>
          <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Administrator Security &amp; Credentials</h4>
          <p className="text-[11px] text-ink-muted">Principal / Admin master credentials and secure access</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Administrator Name *
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              placeholder="e.g. Administrator / Principal"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Admin Mobile Phone
              </label>
              {form.contact_number && (
                <span className={`text-[10px] font-bold ${isAdminPhoneValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isAdminPhoneValid ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <input
              type="tel"
              value={form.contact_number || ''}
              onChange={(e) => onChange('contact_number', e.target.value)}
              placeholder="03001234567"
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.contact_number && !isAdminPhoneValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              New Master Password (Optional)
            </label>
            {form.new_password && (
              <span className={`text-[10px] font-bold ${passStrength.color.split(' ')[0]}`}>
                Strength: {passStrength.label}
              </span>
            )}
          </div>
          <input
            type="password"
            value={form.new_password || ''}
            onChange={(e) => onChange('new_password', e.target.value)}
            placeholder="Leave blank to maintain existing master password"
            className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {form.new_password && (
            <div className="w-full bg-surface-secondary h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all duration-300 ${
                  passStrength.score === 1
                    ? 'w-1/4 bg-rose-500'
                    : passStrength.score === 2
                    ? 'w-2/4 bg-amber-500'
                    : passStrength.score === 3
                    ? 'w-3/4 bg-blue-500'
                    : 'w-full bg-emerald-500'
                }`}
              />
            </div>
          )}
        </div>

        {form.new_password && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Confirm Master Password
              </label>
              {form.confirm_password && (
                <span className={`text-[10px] font-bold ${passMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {passMatch ? 'Passwords Match' : 'Passwords Do Not Match'}
                </span>
              )}
            </div>
            <input
              type="password"
              value={form.confirm_password || ''}
              onChange={(e) => onChange('confirm_password', e.target.value)}
              placeholder="Confirm new master password"
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.confirm_password && !passMatch ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
            />
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-primary space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-primary shrink-0" />
            General Settings Integration
          </p>
          <p className="text-[11px] leading-relaxed text-ink-muted">
            These institutional configurations will automatically synchronize across your Fee Challans, Admission Letters, and Staff Reports.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOnboardingSteps;
