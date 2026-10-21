import { formatCnic, isValidCnic, isValidPhone, isValidEmail } from '../../../../utils/validators';

const GENDERS = ['Male', 'Female', 'Other'];
const MARITAL_STATUSES = ['Single', 'Married', 'Divorced', 'Widowed'];

const ApplicantBasicInfoCard = ({ formData, onChange, teachers = [], errors = {} }) => {
  const isCnicValid = !formData.cnic || isValidCnic(formData.cnic);
  const isPhoneValid = !formData.contact_number || isValidPhone(formData.contact_number);
  const isEmailValid = !formData.email || isValidEmail(formData.email);

  return (
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
            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium transition-all ${
              errors.name ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-white/10 focus:border-primary/60'
            }`}
          />
          {errors.name && <p className="text-[10px] text-bad font-semibold mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Father Name (Optional)
          </label>
          <input
            type="text"
            value={formData.father_name || ''}
            onChange={(e) => onChange('father_name', e.target.value)}
            placeholder="Father name"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Gender (Optional)
          </label>
          <select
            value={formData.gender || ''}
            onChange={(e) => onChange('gender', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            <option value="">Select</option>
            {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Date of Birth (Optional)
          </label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => onChange('dob', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Contact No (Optional)
          </label>
          <input
            type="text"
            value={formData.contact_number || ''}
            onChange={(e) => onChange('contact_number', e.target.value)}
            placeholder="Phone"
            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium ${
              errors.contact_number || !isPhoneValid ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-white/10 focus:border-primary/60'
            }`}
          />
          {(errors.contact_number || !isPhoneValid) && (
            <p className="text-[10px] text-bad font-semibold mt-1">{errors.contact_number || 'Invalid phone'}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            CNIC No (Optional)
          </label>
          <input
            type="text"
            value={formData.cnic || ''}
            onChange={(e) => onChange('cnic', formatCnic(e.target.value))}
            placeholder="12345-1234567-1"
            maxLength={15}
            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-mono ${
              errors.cnic || !isCnicValid ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-white/10 focus:border-primary/60'
            }`}
          />
          {(errors.cnic || !isCnicValid) && (
            <p className="text-[10px] text-bad font-semibold mt-1">{errors.cnic || '13 digits required'}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Marital Status (Optional)
          </label>
          <select
            value={formData.marital_status || ''}
            onChange={(e) => onChange('marital_status', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium"
          >
            <option value="">Select</option>
            {MARITAL_STATUSES.map((ms) => (<option key={ms} value={ms}>{ms}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Applied On (Optional)
          </label>
          <input
            type="date"
            value={formData.applied_on || ''}
            onChange={(e) => onChange('applied_on', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Added On (Optional)
          </label>
          <input
            type="date"
            value={formData.added_on || ''}
            onChange={(e) => onChange('added_on', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Replacing Existing Staff (Optional)
          </label>
          <select
            value={formData.replacement_staff || ''}
            onChange={(e) => onChange('replacement_staff', e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-[#161616] text-ink dark:text-ink-dark outline-none font-medium cursor-pointer"
          >
            <option value="">None (New Position / Vacancy)</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>{t.name} {t.basic_salary ? `- Rs. ${t.basic_salary.toLocaleString()}` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">
            Email Address (Optional)
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="e.g. applicant@school.edu.pk"
            className={`w-full px-3.5 py-2 text-xs rounded-xl border bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none font-medium ${
              errors.email || !isEmailValid ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-white/10 focus:border-primary/60'
            }`}
          />
          {(errors.email || !isEmailValid) && (
            <p className="text-[10px] text-bad font-semibold mt-1">{errors.email || 'Invalid email'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantBasicInfoCard;
