import { Copy } from 'lucide-react';

const BasicContactFields = ({ formData, onChange }) => {
  const formatCnic = (val) => {
    const raw = val.replace(/\D/g, '').slice(0, 13);
    if (raw.length > 12) return `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
    if (raw.length > 5) return `${raw.slice(0, 5)}-${raw.slice(5)}`;
    return raw;
  };

  const copyContact = () => {
    if (formData.contact_number) onChange('whatsapp_number', formData.contact_number);
  };

  return (
    <div className="space-y-3 pt-2 border-t border-line dark:border-line-dark">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Marital Status</label>
          <select
            value={formData.marital_status || 'Single'}
            onChange={(e) => onChange('marital_status', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Contact Number</label>
          <div className="flex">
            <span className="px-2.5 py-1.5 rounded-l-xl border border-r-0 border-line dark:border-line-dark bg-surface-secondary text-xs text-ink-muted">PK +92</span>
            <input
              type="text"
              value={formData.contact_number || ''}
              onChange={(e) => onChange('contact_number', e.target.value)}
              placeholder="3001234567"
              className="flex-1 px-3 py-1.5 rounded-r-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-ink dark:text-ink-dark">WhatsApp</label>
            <button type="button" onClick={copyContact} className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold">
              <Copy className="w-3 h-3" /> Same
            </button>
          </div>
          <input
            type="text"
            value={formData.whatsapp_number || ''}
            onChange={(e) => onChange('whatsapp_number', e.target.value)}
            placeholder="03001234567"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">CNIC No</label>
          <input
            type="text"
            value={formData.cnic || ''}
            onChange={(e) => onChange('cnic', formatCnic(e.target.value))}
            placeholder="42101-1234567-1"
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">CNIC Expiry Date</label>
          <input
            type="date"
            value={formData.cnic_expiry ? formData.cnic_expiry.slice(0, 10) : ''}
            onChange={(e) => onChange('cnic_expiry', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Email *</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="teacher@school.edu.pk"
            required
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-ink dark:text-ink-dark">
          <input
            type="checkbox"
            checked={Boolean(formData.is_coordinator)}
            onChange={(e) => onChange('is_coordinator', e.target.checked)}
            className="rounded text-primary focus:ring-primary"
          />
          <span>Mark this staff as Coordinator</span>
        </label>
        <button
          type="button"
          onClick={() => onChange('status', formData.status === 'Active' ? 'Inactive' : 'Active')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${formData.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-bad/10 text-bad'}`}
        >
          {formData.status === 'Active' ? 'Active' : 'Inactive'}
        </button>
      </div>
    </div>
  );
};

export default BasicContactFields;
