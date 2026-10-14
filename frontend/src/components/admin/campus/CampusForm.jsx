import { AlertCircle } from 'lucide-react';

const CampusForm = ({
  formData,
  touched,
  mode,
  isFormValid,
  isSubmitting,
  isNameValid,
  isEmailValid,
  isWebsiteValid,
  isPhoneValid,
  onChange,
  onBlur,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          Campus Name <span className="text-bad">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          onBlur={() => onBlur('name')}
          placeholder="e.g. Main Campus / North Branch"
          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
            touched.name && !isNameValid
              ? 'border-bad focus:ring-bad'
              : 'border-line dark:border-white/10 focus:border-primary'
          } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        {touched.name && !isNameValid && (
          <p className="flex items-center gap-1 text-xs text-bad mt-1">
            <AlertCircle className="w-3.5 h-3.5" /> Campus name is required
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          Official Email (Optional)
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          onBlur={() => onBlur('email')}
          placeholder="campus@school.edu.pk"
          className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
            touched.email && !isEmailValid
              ? 'border-bad focus:ring-bad'
              : 'border-line dark:border-white/10 focus:border-primary'
          } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
        />
        {touched.email && !isEmailValid && (
          <p className="flex items-center gap-1 text-xs text-bad mt-1">
            <AlertCircle className="w-3.5 h-3.5" /> Enter a valid email (e.g. campus@school.edu.pk)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Website (Optional)
          </label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={onChange}
            onBlur={() => onBlur('website')}
            placeholder="www.school.edu.pk"
            className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
              touched.website && !isWebsiteValid
                ? 'border-bad focus:ring-bad'
                : 'border-line dark:border-white/10 focus:border-primary'
            } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
          />
          {touched.website && !isWebsiteValid && (
            <p className="flex items-center gap-1 text-xs text-bad mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Enter valid URL (e.g. www.school.com)
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Contact Number (Optional)
          </label>
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={onChange}
            onBlur={() => onBlur('contact_number')}
            placeholder="03001234567 / +923001234567"
            className={`w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border ${
              touched.contact_number && !isPhoneValid
                ? 'border-bad focus:ring-bad'
                : 'border-line dark:border-white/10 focus:border-primary'
            } text-ink dark:text-ink-dark outline-none focus:ring-2 focus:ring-primary/20 transition-all`}
          />
          {touched.contact_number && !isPhoneValid && (
            <p className="flex items-center gap-1 text-xs text-bad mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> Enter valid contact number
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          Campus Address (Optional)
        </label>
        <textarea
          name="address"
          rows="2"
          value={formData.address}
          onChange={onChange}
          placeholder="Street address, Sector, City..."
          className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-line dark:border-white/10">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-sm font-medium text-ink-sub dark:text-ink-sub-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-all ${
            !isFormValid || isSubmitting
              ? 'bg-primary/50 cursor-not-allowed opacity-60'
              : 'bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg'
          }`}
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Campus' : 'Create Campus'}
        </button>
      </div>
    </form>
  );
};

export default CampusForm;
