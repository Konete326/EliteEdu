import AvatarUploadField from '../../../common/AvatarUploadField';
import { formatCnic, isValidCnic, isValidPhone, isValidEmail } from '../../../../utils/validators';

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

const ApplicantPersonalInfoTab = ({ formData, onChange, teachers = [] }) => {
  const isCnicValid = isValidCnic(formData.cnic);
  const isPhoneValid = isValidPhone(formData.contact_number);
  const isEmailValid = isValidEmail(formData.email);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Profile</h3>
        <div className="flex items-center gap-6">
          <AvatarUploadField
            value={formData.photo_url}
            onChange={(url) => onChange('photo_url', url)}
            label="Profile Picture"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-5">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
              Name <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Full name"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Father Name</label>
            <input
              type="text"
              value={formData.father_name || ''}
              onChange={(e) => onChange('father_name', e.target.value)}
              placeholder="Father name"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Gender</label>
            <select
              value={formData.gender || ''}
              onChange={(e) => onChange('gender', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={formData.dob || ''}
              onChange={(e) => onChange('dob', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink dark:text-ink-dark">Contact No</label>
              {!isPhoneValid && <span className="text-[10px] text-bad font-semibold">Invalid phone</span>}
            </div>
            <input
              type="text"
              value={formData.contact_number || ''}
              onChange={(e) => onChange('contact_number', e.target.value)}
              placeholder="Phone"
              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium ${
                !isPhoneValid ? 'border-bad' : 'border-line dark:border-white/10 focus:border-primary/60'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink dark:text-ink-dark">CNIC No</label>
              {!isCnicValid && <span className="text-[10px] text-bad font-semibold">13 digits required</span>}
            </div>
            <input
              type="text"
              value={formData.cnic || ''}
              onChange={(e) => onChange('cnic', formatCnic(e.target.value))}
              placeholder="12345-1234567-1"
              maxLength={15}
              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-mono ${
                !isCnicValid ? 'border-bad' : 'border-line dark:border-white/10 focus:border-primary/60'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Marital Status</label>
            <select
              value={formData.marital_status || ''}
              onChange={(e) => onChange('marital_status', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
            >
              <option value="">Select</option>
              {MARITAL_STATUSES.map((ms) => (
                <option key={ms} value={ms}>{ms}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Applied On</label>
            <input
              type="date"
              value={formData.applied_on || ''}
              onChange={(e) => onChange('applied_on', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Added On</label>
            <input
              type="date"
              value={formData.added_on || ''}
              onChange={(e) => onChange('added_on', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Staff Replacement</label>
            <select
              value={formData.replacement_staff || ''}
              onChange={(e) => onChange('replacement_staff', e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
            >
              <option value="">Search staff...</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.basic_salary ? `- Rs. ${t.basic_salary.toLocaleString()}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-ink dark:text-ink-dark">Email Address</label>
              {!isEmailValid && <span className="text-[10px] text-bad font-semibold">Invalid email</span>}
            </div>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="e.g. applicant@school.edu.pk"
              className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium ${
                !isEmailValid ? 'border-bad' : 'border-line dark:border-white/10 focus:border-primary/60'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantPersonalInfoTab;
