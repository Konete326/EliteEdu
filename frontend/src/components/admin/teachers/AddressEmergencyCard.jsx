import { Copy, PhoneCall } from 'lucide-react';

const AddressEmergencyCard = ({ formData, onChange, onEmergencyChange }) => {
  const copyCurrentToPermanent = () => {
    if (formData.current_address) onChange('permanent_address', formData.current_address);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-line-dark">
          Address & Notes
        </h3>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Current Address</label>
          <textarea
            rows={2}
            value={formData.current_address || ''}
            onChange={(e) => onChange('current_address', e.target.value)}
            placeholder="House/Street, Area, City"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-ink dark:text-ink-dark">Permanent Address</label>
            <button type="button" onClick={copyCurrentToPermanent} className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold">
              <Copy className="w-3 h-3" /> Same as Current
            </button>
          </div>
          <textarea
            rows={2}
            value={formData.permanent_address || ''}
            onChange={(e) => onChange('permanent_address', e.target.value)}
            placeholder="Permanent Domicile / Village Address"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Administrative Notes</label>
          <textarea
            rows={2}
            value={formData.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Special remarks, certifications, or internal notes..."
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none resize-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <PhoneCall className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Emergency Contact</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Contact Name</label>
            <input
              type="text"
              value={formData.emergency_contact?.name || ''}
              onChange={(e) => onEmergencyChange('name', e.target.value)}
              placeholder="e.g. Brother, Spouse"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Relationship</label>
            <input
              type="text"
              value={formData.emergency_contact?.relation || ''}
              onChange={(e) => onEmergencyChange('relation', e.target.value)}
              placeholder="e.g. Brother"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Emergency Phone</label>
            <input
              type="text"
              value={formData.emergency_contact?.phone || ''}
              onChange={(e) => onEmergencyChange('phone', e.target.value)}
              placeholder="03001234567"
              className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressEmergencyCard;
