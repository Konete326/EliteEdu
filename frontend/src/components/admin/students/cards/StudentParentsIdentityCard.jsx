import { Users, Sparkles } from 'lucide-react';

const StudentParentsIdentityCard = ({ formData, onNestedChange, onChange, onRefreshFamilyNumber }) => {
  const parentsCnic = formData.parents_cnic || {};

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <Users className="w-4 h-4 text-primary" />
        <span>Parental & Primary Guardian Details</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-ink-sub dark:text-ink-sub-dark">
              Family Code / Number
            </label>
            {onRefreshFamilyNumber && (
              <button
                type="button"
                onClick={onRefreshFamilyNumber}
                className="text-[11px] text-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                title="Regenerate next sequential family number"
              >
                <Sparkles className="w-3 h-3" /> Auto-Seq
              </button>
            )}
          </div>
          <input
            type="text"
            value={formData.family_number || ''}
            onChange={(e) => onChange('family_number', e.target.value)}
            placeholder="e.g. FAM-0001"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none font-mono font-medium tracking-wide"
          />
          <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark mt-1">
            Auto-assigned sequentially (FAM-0001). Can match siblings.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Mother / Guardian Name (Optional)
          </label>
          <input
            type="text"
            value={formData.mother_guardian_name || ''}
            onChange={(e) => onChange('mother_guardian_name', e.target.value)}
            placeholder="e.g. Bilqees Akhtar"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Emergency Contact No. (Optional)
          </label>
          <input
            type="text"
            value={formData.emergency_contact_no || ''}
            onChange={(e) => onChange('emergency_contact_no', e.target.value)}
            placeholder="+92 300 1234567"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Father CNIC (Optional)
          </label>
          <input
            type="text"
            value={parentsCnic.father_cnic || ''}
            onChange={(e) => onNestedChange('parents_cnic', 'father_cnic', e.target.value)}
            placeholder="42101-XXXXXXXX-X"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Mother CNIC (Optional)
          </label>
          <input
            type="text"
            value={parentsCnic.mother_cnic || ''}
            onChange={(e) => onNestedChange('parents_cnic', 'mother_cnic', e.target.value)}
            placeholder="42101-XXXXXXXX-X"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Guardian CNIC (Optional)
          </label>
          <input
            type="text"
            value={parentsCnic.guardian_cnic || ''}
            onChange={(e) => onNestedChange('parents_cnic', 'guardian_cnic', e.target.value)}
            placeholder="42101-XXXXXXXX-X"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentParentsIdentityCard;
