import { GraduationCap, Users, Building2, BookOpen } from 'lucide-react';
import SearchableSelect from '../../common/SearchableSelect';

const TransferPersonSelect = ({ form, setForm, personList = [], isStudent, selectedPerson, campuses = [] }) => {
  const options = personList.map((p) => {
    const code = p.gr_number || p.employee_code || p.email || 'N/A';
    const campusName = p.campus_id?.name || campuses.find((c) => String(c._id) === String(p.campus_id))?.name || 'Main Campus';
    const extra = isStudent
      ? `Class: ${p.current_grade?.name || 'N/A'} (${p.current_section || 'A'}) • Branch: ${campusName}`
      : `Role: ${p.designation || p.role || 'Staff'} • Branch: ${campusName}`;

    return {
      value: p._id,
      label: `${p.name} (${code})`,
      sublabel: extra
    };
  });

  const currentCampusName = selectedPerson?.campus_id?.name ||
    campuses.find((c) => String(c._id) === String(selectedPerson?.campus_id))?.name ||
    'Main Campus';

  return (
    <div className="space-y-3">
      <div className="flex p-1 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark">
        <button
          type="button"
          onClick={() => setForm({ ...form, entity_type: 'Student', person_id: '', to_grade_id: '', to_section: 'A' })}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            isStudent
              ? 'bg-primary text-white shadow-xs'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <GraduationCap size={14} />
          <span>Student Relocation</span>
        </button>
        <button
          type="button"
          onClick={() => setForm({ ...form, entity_type: 'Staff', person_id: '', to_grade_id: '', to_section: '' })}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            !isStudent
              ? 'bg-primary text-white shadow-xs'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Users size={14} />
          <span>Faculty / Staff</span>
        </button>
      </div>

      <div>
        <SearchableSelect
          label={isStudent ? 'Select Student to Transfer *' : 'Select Faculty Member to Transfer *'}
          value={form.person_id}
          onChange={(val) => setForm({ ...form, person_id: val })}
          options={options}
          placeholder={isStudent ? 'Search by student name or GR number...' : 'Search by teacher name or employee ID...'}
        />

        {selectedPerson && (
          <div className="mt-2.5 p-3 rounded-xl bg-surface-secondary/70 dark:bg-surface-secondary-dark/70 border border-line dark:border-line-dark flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                {selectedPerson.name?.charAt(0) || 'P'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-ink dark:text-white truncate">
                  {selectedPerson.name}
                </p>
                <p className="text-[10px] text-ink-muted font-mono">
                  ID: {selectedPerson.gr_number || selectedPerson.employee_code || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] self-end sm:self-center">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Building2 size={12} />
                <span>{currentCampusName}</span>
              </span>
              {isStudent && (
                <span className="flex items-center gap-1 text-ink-muted font-medium">
                  <BookOpen size={12} />
                  <span>{selectedPerson.current_grade?.name || 'Class'} ({selectedPerson.current_section || 'A'})</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferPersonSelect;
