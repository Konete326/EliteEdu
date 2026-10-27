import { User, Phone, MapPin, GraduationCap, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCnic, validateCnic, validatePhone, getPasswordStrength } from '../../../utils/onboardingValidators';

const TeacherOnboardingSteps = ({ step, form, onChange }) => {
  const isCnicValid = !form.cnic || validateCnic(form.cnic);
  const isPhoneValid = !form.contact_number || validatePhone(form.contact_number);
  const isWhatsappValid = !form.whatsapp_number || validatePhone(form.whatsapp_number);
  const isEmergencyValid = !form.emergency_contact_phone || validatePhone(form.emergency_contact_phone);
  const passStrength = getPasswordStrength(form.new_password || '');
  const passMatch = !form.confirm_password || form.new_password === form.confirm_password;

  if (step === 1) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <User className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Personal Identity &amp; Bio</h4>
            <p className="text-[11px] text-ink-muted">Set up your teacher profile identity and official details</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              placeholder="e.g. Muhammad Asif Khan"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Gender
              </label>
              <select
                value={form.gender || 'Male'}
                onChange={(e) => onChange('gender', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Date of Birth (Optional)
              </label>
              <input
                type="date"
                value={form.dob ? String(form.dob).slice(0, 10) : ''}
                onChange={(e) => onChange('dob', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                CNIC Number (Optional)
              </label>
              {form.cnic && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${isCnicValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isCnicValid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {isCnicValid ? 'Valid CNIC Format' : 'Must be 13 digits (42101-1234567-1)'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={form.cnic || ''}
              onChange={(e) => onChange('cnic', formatCnic(e.target.value))}
              placeholder="42101-1234567-1"
              maxLength={15}
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.cnic && !isCnicValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Profile Photo URL (Optional)
            </label>
            <input
              type="url"
              value={form.photo_url || ''}
              onChange={(e) => onChange('photo_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
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
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Contact &amp; Residence Details</h4>
            <p className="text-[11px] text-ink-muted">Communication channels and emergency address</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  Primary Mobile Phone
                </label>
                {form.contact_number && (
                  <span className={`text-[10px] font-bold ${isPhoneValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isPhoneValid ? 'Valid' : 'Invalid'}
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={form.contact_number || ''}
                onChange={(e) => onChange('contact_number', e.target.value)}
                placeholder="03001234567"
                className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                  form.contact_number && !isPhoneValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  WhatsApp Number
                </label>
                {form.whatsapp_number && (
                  <span className={`text-[10px] font-bold ${isWhatsappValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isWhatsappValid ? 'Valid' : 'Invalid'}
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={form.whatsapp_number || ''}
                onChange={(e) => onChange('whatsapp_number', e.target.value)}
                placeholder="03001234567"
                className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                  form.whatsapp_number && !isWhatsappValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Emergency Contact Name (Optional)
              </label>
              <input
                type="text"
                value={form.emergency_contact_name || ''}
                onChange={(e) => onChange('emergency_contact_name', e.target.value)}
                placeholder="e.g. Brother / Spouse"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  Emergency Phone (Optional)
                </label>
                {form.emergency_contact_phone && (
                  <span className={`text-[10px] font-bold ${isEmergencyValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {isEmergencyValid ? 'Valid' : 'Invalid'}
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={form.emergency_contact_phone || ''}
                onChange={(e) => onChange('emergency_contact_phone', e.target.value)}
                placeholder="03XXXXXXXXX"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Current Address (Optional)
              </label>
              <input
                type="text"
                value={form.current_address || ''}
                onChange={(e) => onChange('current_address', e.target.value)}
                placeholder="House / Street / Area"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                City (Optional)
              </label>
              <input
                type="text"
                value={form.city || ''}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="e.g. Karachi"
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <GraduationCap className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Academic &amp; Professional Credentials</h4>
            <p className="text-[11px] text-ink-muted">Teaching expertise, degree level and experience record</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Highest Qualification (Optional)
            </label>
            <input
              type="text"
              value={form.qualification || ''}
              onChange={(e) => onChange('qualification', e.target.value)}
              placeholder="e.g. M.Sc Mathematics / B.Ed / BS English"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Specialization / Major Subjects (Optional)
            </label>
            <input
              type="text"
              value={form.specialization || ''}
              onChange={(e) => onChange('specialization', e.target.value)}
              placeholder="e.g. Physics, Chemistry, Calculus"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Years of Teaching Experience (Optional)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.experience_years || 0}
              onChange={(e) => onChange('experience_years', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
        <Lock className="w-5 h-5 text-primary" />
        <div>
          <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Security &amp; Account Protection</h4>
          <p className="text-[11px] text-ink-muted">Optionally change your initial password to a secure personal password</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              New Personal Password (Optional)
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
            placeholder="Leave empty to keep current password"
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
                Confirm New Password
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
              placeholder="Re-enter new password"
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.confirm_password && !passMatch ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
            />
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            Ready to Launch Faculty Portal
          </p>
          <p className="text-[11px] leading-relaxed text-ink-muted">
            All details can be edited anytime from your Profile menu. Click "Complete Setup" to finish or "Skip" to use defaults.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherOnboardingSteps;
