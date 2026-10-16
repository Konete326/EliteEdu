import { AlertCircle } from 'lucide-react';

const CampusContactFields = ({
  formData,
  touched,
  isEmailValid,
  isWebsiteValid,
  isPhoneValid,
  onChange,
  onBlur
}) => {
  return (
    <div className="space-y-4">
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
            touched.email && !isEmailValid ? 'border-bad focus:ring-bad' : 'border-line dark:border-white/10 focus:border-primary'
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
              touched.website && !isWebsiteValid ? 'border-bad focus:ring-bad' : 'border-line dark:border-white/10 focus:border-primary'
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
              touched.contact_number && !isPhoneValid ? 'border-bad focus:ring-bad' : 'border-line dark:border-white/10 focus:border-primary'
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
    </div>
  );
};

export default CampusContactFields;
