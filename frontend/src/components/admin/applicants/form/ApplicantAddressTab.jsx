import { Copy } from 'lucide-react';

const ApplicantAddressTab = ({ formData, onChange }) => {
  const copyCurrentToPermanent = () => {
    if (formData.current_address) {
      onChange('permanent_address', formData.current_address);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-surface dark:bg-[#111111] border border-line dark:border-white/10 shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-ink dark:text-ink-dark pb-2 border-b border-line dark:border-white/10">
        Address Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">City (Optional)</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            placeholder="e.g. Karachi, Lahore, Islamabad"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Area / Town (Optional)</label>
          <input
            type="text"
            value={formData.area || ''}
            onChange={(e) => onChange('area', e.target.value)}
            placeholder="e.g. Gulshan-e-Iqbal, North Nazimabad"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1.5">Current Address (Optional)</label>
          <textarea
            rows={3}
            value={formData.current_address || ''}
            onChange={(e) => onChange('current_address', e.target.value)}
            placeholder="House/Street no, Block, Sector, City"
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="text-xs font-semibold text-ink dark:text-ink-dark">Permanent Address (Optional)</label>
          <button
            type="button"
            onClick={copyCurrentToPermanent}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:underline"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Same as Current Address</span>
          </button>
        </div>

        <textarea
          rows={3}
          value={formData.permanent_address || ''}
          onChange={(e) => onChange('permanent_address', e.target.value)}
          placeholder="Permanent hometown address"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface-secondary/40 dark:bg-black/20 text-ink dark:text-ink-dark outline-none focus:border-primary/60 font-medium"
        />
      </div>
    </div>
  );
};

export default ApplicantAddressTab;
