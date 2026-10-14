import { Users, Plus, Trash2, ShieldAlert } from 'lucide-react';

const StudentFamilyTab = ({ formData, onNestedChange, onChange }) => {
  const parentsCnic = formData.parents_cnic || {};
  const familyMembers = formData.family_members || [];

  const handleParentCnicChange = (field, val) => {
    onNestedChange('parents_cnic', field, val);
  };

  const handleAddMember = () => {
    const updated = [
      ...familyMembers,
      {
        relation: 'Brother',
        name: '',
        cnic: '',
        occupation: '',
        education: '',
        monthly_income: 0,
        email: '',
        office_contact: ''
      }
    ];
    onChange('family_members', updated);
  };

  const handleMemberChange = (index, field, val) => {
    const updated = familyMembers.map((m, i) => (i === index ? { ...m, [field]: val } : m));
    onChange('family_members', updated);
  };

  const handleRemoveMember = (index) => {
    const updated = familyMembers.filter((_, i) => i !== index);
    onChange('family_members', updated);
  };

  return (
    <div className="space-y-6">
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
              onChange={(e) => handleParentCnicChange('father_cnic', e.target.value)}
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
              onChange={(e) => handleParentCnicChange('mother_cnic', e.target.value)}
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
              onChange={(e) => handleParentCnicChange('guardian_cnic', e.target.value)}
              placeholder="42101-XXXXXXXX-X"
              className="w-full px-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-ink dark:text-ink-dark focus:border-primary outline-none"
            />
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <Users className="w-4 h-4 text-primary" />
            <span>Family Members & Siblings</span>
          </div>
          <button
            type="button"
            onClick={handleAddMember}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {familyMembers.length === 0 ? (
          <p className="text-xs text-ink-muted italic py-3">
            No additional family members or siblings added yet. Click &apos;Add Member&apos; to register brothers/sisters or guardians.
          </p>
        ) : (
          <div className="space-y-3">
            {familyMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-xs"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Relation</label>
                  <select
                    value={member.relation || 'Brother'}
                    onChange={(e) => handleMemberChange(idx, 'relation', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] text-ink dark:text-ink-dark outline-none"
                  >
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Grandmother">Grandmother</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Member Name</label>
                  <input
                    type="text"
                    value={member.name || ''}
                    onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                    placeholder="Name"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] text-ink dark:text-ink-dark outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">CNIC</label>
                  <input
                    type="text"
                    value={member.cnic || ''}
                    onChange={(e) => handleMemberChange(idx, 'cnic', e.target.value)}
                    placeholder="CNIC"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] text-ink dark:text-ink-dark outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Occupation</label>
                  <input
                    type="text"
                    value={member.occupation || ''}
                    onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                    placeholder="Occupation / Student"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-line dark:border-white/10 bg-surface dark:bg-[#0c0c0c] text-ink dark:text-ink-dark outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end pt-3 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="p-1.5 text-bad hover:bg-bad-soft dark:hover:bg-bad/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFamilyTab;
