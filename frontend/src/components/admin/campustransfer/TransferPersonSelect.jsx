import SearchableSelect from '../../common/SearchableSelect';

const TransferPersonSelect = ({ form, setForm, personList, isStudent, selectedPerson, campuses }) => {
  const options = personList.map((p) => {
    const code = p.gr_number || p.employee_code || p.email || 'N/A';
    const campusName = p.campus_id?.name || campuses.find((c) => String(c._id) === String(p.campus_id))?.name || 'Main Campus';
    const extra = isStudent
      ? `Grade: ${p.current_grade?.name || 'N/A'} (${p.current_section || 'A'}) | Branch: ${campusName}`
      : `Role: ${p.designation || p.role || 'Staff'} | Branch: ${campusName}`;

    return {
      value: p._id,
      label: `${p.name} (${code})`,
      sublabel: extra
    };
  });

  return (
    <div className="space-y-3">
      <div className="flex p-0.5 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line">
        <button
          type="button"
          onClick={() => setForm({ ...form, entity_type: 'Student', person_id: '' })}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${isStudent ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
        >
          Student Transfer
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, entity_type: 'Staff', person_id: '' })}
          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${!isStudent ? 'bg-surface dark:bg-surface-dark text-primary shadow-xs' : 'text-ink-muted'}`}
        >
          Teacher / Staff
        </button>
      </div>

      <div>
        <SearchableSelect
          label={isStudent ? 'Select Student *' : 'Select Teacher / Staff *'}
          value={form.person_id}
          onChange={(val) => setForm({ ...form, person_id: val })}
          options={options}
          placeholder={isStudent ? 'Type student name or GR number...' : 'Type staff name or code...'}
        />

        {selectedPerson && (
          <div className="mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-ink dark:text-ink-dark flex items-center justify-between">
            <span>Current Branch: <strong className="text-primary">{selectedPerson.campus_id?.name || campuses.find((c) => String(c._id) === String(selectedPerson.campus_id))?.name || 'Main Campus'}</strong></span>
            <span className="font-semibold text-ink-muted">{isStudent ? `Class Section: ${selectedPerson.current_section || 'A'}` : `Designation: ${selectedPerson.designation || 'Teacher'}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferPersonSelect;
