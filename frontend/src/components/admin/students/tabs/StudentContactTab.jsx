import { MapPin, Phone, Home, Navigation } from 'lucide-react';

const StudentContactTab = ({ formData, onNestedChange, onChange }) => {
  const address = formData.address || {};

  const handleAddressChange = (field, val) => {
    onNestedChange('address', field, val);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <Phone className="w-4 h-4 text-primary" />
          <span>Telecommunications & Primary Contacts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Primary Contact Number <span className="text-bad">*</span>
            </label>
            <input
              type="text"
              value={formData.contact_number || ''}
              onChange={(e) => onChange('contact_number', e.target.value)}
              placeholder="+92 300 1234567"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Emergency Contact Number
            </label>
            <input
              type="text"
              value={formData.emergency_contact_no || ''}
              onChange={(e) => onChange('emergency_contact_no', e.target.value)}
              placeholder="+92 321 7654321"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
          <Home className="w-4 h-4 text-primary" />
          <span>Residential Addresses</span>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Current Residential Address
            </label>
            <textarea
              rows="2"
              value={address.current_address || ''}
              onChange={(e) => handleAddressChange('current_address', e.target.value)}
              placeholder="House #, Street #, Block / Sector..."
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
              Permanent Address
            </label>
            <textarea
              rows="2"
              value={address.permanent_address || ''}
              onChange={(e) => handleAddressChange('permanent_address', e.target.value)}
              placeholder="Permanent home address..."
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
                Area / Town / Union Council
              </label>
              <input
                type="text"
                value={address.area || ''}
                onChange={(e) => handleAddressChange('area', e.target.value)}
                placeholder="e.g. Gulshan-e-Iqbal, Block 13-D"
                className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentContactTab;
