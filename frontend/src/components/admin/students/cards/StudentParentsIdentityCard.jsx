import { Users } from 'lucide-react';

const StudentParentsIdentityCard = ({ formData, onNestedChange, onChange }) => {
  const parentsCnic = formData.parents_cnic || {};

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <Users className="w-4 h-4 text-primary" />
        <span>Parental & Primary Guardian Details</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Family Code / Number
          </label>
          <input
            type="text"
            value={formData.family_number || ''}
            onChange={(e) => onChange('family_number', e.target.value)}
            placeholder="e.g. FAM-8821"
            className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1">
            Mother / Guardian Name
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
            Emergency Contact No.
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
            Father CNIC
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
            Mother CNIC
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
            Guardian CNIC (if applicable)
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
