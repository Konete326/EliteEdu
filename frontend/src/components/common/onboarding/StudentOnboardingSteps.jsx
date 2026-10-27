import { User, Phone, MapPin, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { validatePhone, getPasswordStrength } from '../../../utils/onboardingValidators';

const StudentOnboardingSteps = ({ step, form, onChange }) => {
  const isPhoneValid = !form.contact_number || validatePhone(form.contact_number);
  const isEmergencyValid = !form.emergency_contact_no || validatePhone(form.emergency_contact_no);
  const passStrength = getPasswordStrength(form.new_password || '');
  const passMatch = !form.confirm_password || form.new_password === form.confirm_password;

  if (step === 1) {
    return (
      <div className="space-y-4 animate-in fade-in">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <User className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Student Identity &amp; Bio</h4>
            <p className="text-[11px] text-ink-muted">Set up student personal profile details</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              placeholder="e.g. Muhammad Usman"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
                Gender (Optional)
              </label>
              <select
                value={form.gender || ''}
                onChange={(e) => onChange('gender', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="">Select Gender</option>
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
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Blood Group (Optional)
            </label>
            <select
              value={form.blood_group || ''}
              onChange={(e) => onChange('blood_group', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
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
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Guardian &amp; Emergency Contacts</h4>
            <p className="text-[11px] text-ink-muted">Official mobile and emergency communication channels</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Student / Guardian Mobile (Optional)
              </label>
              {form.contact_number && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${isPhoneValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isPhoneValid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {isPhoneValid ? 'Valid Phone' : 'Format: 03XX-XXXXXXX'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={form.contact_number || ''}
              onChange={(e) => onChange('contact_number', e.target.value)}
              placeholder="0300-1234567"
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.contact_number && !isPhoneValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Emergency Contact Number (Optional)
              </label>
              {form.emergency_contact_no && (
                <span className={`text-[10px] font-bold flex items-center gap-1 ${isEmergencyValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isEmergencyValid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {isEmergencyValid ? 'Valid Emergency Contact' : 'Format: 03XX-XXXXXXX'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={form.emergency_contact_no || ''}
              onChange={(e) => onChange('emergency_contact_no', e.target.value)}
              placeholder="0312-3456789"
              className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
                form.emergency_contact_no && !isEmergencyValid ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
              }`}
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
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Residential Location</h4>
            <p className="text-[11px] text-ink-muted">Address and neighborhood for transport and school records</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-ink dark:text-ink-dark mb-1">
              Home Address (Optional)
            </label>
            <textarea
              rows={3}
              value={form.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="House # 12, Street 4, Block B"
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none resize-none"
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
              placeholder="Lahore / Islamabad / Rawalpindi"
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
          <h4 className="font-bold text-sm text-ink dark:text-ink-dark">Student Portal Security</h4>
          <p className="text-[11px] text-ink-muted">Set up your private student password</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              New Password (Optional)
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
            placeholder="Leave empty to keep default"
            className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:ring-primary focus:outline-none"
          />
          {form.new_password && (
            <div className="w-full h-1 bg-surface-secondary dark:bg-surface-dark-secondary rounded-full mt-1.5 overflow-hidden flex gap-1">
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`h-full flex-1 transition-all ${
                    bar <= passStrength.score ? passStrength.color.split(' ')[1] : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              Confirm Password
            </label>
            {form.confirm_password && (
              <span className={`text-[10px] font-bold flex items-center gap-1 ${passMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                {passMatch ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {passMatch ? 'Passwords Match' : 'Mismatch'}
              </span>
            )}
          </div>
          <input
            type="password"
            value={form.confirm_password || ''}
            onChange={(e) => onChange('confirm_password', e.target.value)}
            placeholder="Confirm password"
            className={`w-full px-3.5 py-2 rounded-xl border bg-surface dark:bg-surface-dark text-xs font-semibold text-ink dark:text-ink-dark focus:ring-1 focus:outline-none ${
              form.confirm_password && !passMatch ? 'border-rose-500 focus:ring-rose-500' : 'border-line dark:border-line-dark focus:ring-primary'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentOnboardingSteps;
