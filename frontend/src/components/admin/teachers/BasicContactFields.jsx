import { Copy } from 'lucide-react';
import { formatCnic, formatPakistaniPhone } from '../../../utils/validators';

const BasicContactFields = ({ formData, errors = {}, onChange }) => {
  const copyContact = () => {
    if (formData.contact_number) onChange('whatsapp_number', formData.contact_number);
  };

  return (
    <div className="space-y-3 pt-2 border-t border-line dark:border-line-dark">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Marital Status (Optional)</label>
          <select
            value={formData.marital_status || 'Single'}
            onChange={(e) => onChange('marital_status', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none cursor-pointer"
          >
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Contact Number (Optional)</label>
          <input
            type="text"
            value={formData.contact_number || ''}
            onChange={(e) => onChange('contact_number', formatPakistaniPhone(e.target.value))}
            placeholder="0300-1234567"
            maxLength={12}
            className={`w-full px-3 py-1.5 rounded-xl border text-xs text-ink dark:text-ink-dark outline-none font-mono ${errors.contact_number ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-line-dark bg-surface-secondary/40'}`}
          />
          {errors.contact_number && <p className="text-[10px] text-bad font-semibold mt-1">{errors.contact_number}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-ink dark:text-ink-dark">WhatsApp (Optional)</label>
            <button type="button" onClick={copyContact} className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold">
              <Copy className="w-3 h-3" /> Same
            </button>
          </div>
          <input
            type="text"
            value={formData.whatsapp_number || ''}
            onChange={(e) => onChange('whatsapp_number', formatPakistaniPhone(e.target.value))}
            placeholder="0300-1234567"
            maxLength={12}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">CNIC No (Optional)</label>
          <input
            type="text"
            value={formData.cnic || ''}
            onChange={(e) => onChange('cnic', formatCnic(e.target.value))}
            placeholder="42101-1234567-1"
            className={`w-full px-3 py-1.5 rounded-xl border text-xs text-ink dark:text-ink-dark outline-none font-mono ${errors.cnic ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-line-dark bg-surface-secondary/40'}`}
          />
          {errors.cnic && <p className="text-[10px] text-bad font-semibold mt-1">{errors.cnic}</p>}
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">CNIC Expiry (Optional)</label>
          <input
            type="date"
            value={formData.cnic_expiry ? formData.cnic_expiry.slice(0, 10) : ''}
            onChange={(e) => onChange('cnic_expiry', e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-ink dark:text-ink-dark mb-1">Work Email (Optional)</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="staff@school.edu.pk"
            className={`w-full px-3 py-1.5 rounded-xl border text-xs text-ink dark:text-ink-dark outline-none transition-all ${errors.email ? 'border-bad ring-2 ring-bad/20 bg-bad/5' : 'border-line dark:border-line-dark bg-surface-secondary/40 focus:ring-1 focus:ring-primary'}`}
          />
          {errors.email && <p className="text-[10px] text-bad font-semibold mt-1">{errors.email}</p>}
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
          <span>Mark as Coordinator</span>
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
