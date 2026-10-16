import { AlertCircle } from 'lucide-react';
import CampusImageUploadField from './CampusImageUploadField';
import CampusContactFields from './CampusContactFields';

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
  onImageChange,
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

      <CampusImageUploadField
        value={formData.image_url}
        onChange={onImageChange}
      />

      <CampusContactFields
        formData={formData}
        touched={touched}
        isEmailValid={isEmailValid}
        isWebsiteValid={isWebsiteValid}
        isPhoneValid={isPhoneValid}
        onChange={onChange}
        onBlur={onBlur}
      />

      <div>
        <label className="block text-xs font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full px-3.5 py-2 rounded-xl text-sm bg-surface dark:bg-[#141414] border border-line dark:border-white/10 text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
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
          disabled={isSubmitting}
          className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Campus' : 'Create Campus'}
        </button>
      </div>
    </form>
  );
};

export default CampusForm;
