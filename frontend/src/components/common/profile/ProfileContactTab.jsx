import { Mail } from 'lucide-react';
import ProfileEmergencyContactFields from './ProfileEmergencyContactFields';

const ProfileContactTab = ({ formData, onChange }) => {
  const emergency = formData.emergency_contact || {};

  const handleEmergencyChange = (field, val) => {
    onChange('emergency_contact', { ...emergency, [field]: val });
  };

  return (
    <div className="bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark rounded-2xl p-6 shadow-xs space-y-5">
      <div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Contact & Residential Details</h3>
        <p className="text-[11px] text-ink-muted">Communication channels and physical address particulars.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Primary Email</span>
            <span className="flex items-center gap-1 text-[10px] text-primary lowercase"><Mail className="w-2.5 h-2.5" /> institutional</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="e.g. teacher@school.edu.pk"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Phone / Mobile Number
          </label>
          <input
            type="text"
            value={formData.contact_number || ''}
            onChange={(e) => onChange('contact_number', e.target.value)}
            placeholder="e.g. +923001234567"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            WhatsApp Number
          </label>
          <input
            type="text"
            value={formData.whatsapp_number || ''}
            onChange={(e) => onChange('whatsapp_number', e.target.value)}
            placeholder="e.g. +923001234567"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <ProfileEmergencyContactFields emergency={emergency} onChange={handleEmergencyChange} />

        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            Residential Address
          </label>
          <input
            type="text"
            value={formData.current_address || ''}
            onChange={(e) => onChange('current_address', e.target.value)}
            placeholder="Street address, house/flat number, area"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            City
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g. Karachi / Lahore / Islamabad"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary/50 dark:bg-[#141419] text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileContactTab;
