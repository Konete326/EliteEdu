import SearchableSelect from '../../common/SearchableSelect';

const StudentBioAcademicFieldsA = ({
  data = {},
  onChange,
  grades = [],
  campuses = [],
  selectedCampusId = '',
  onCampusChange
}) => {
  const currentGradeId = data.current_grade?._id || data.current_grade || '';
  const selectedGrade = grades.find((g) => String(g._id) === String(currentGradeId));
  const selectedGradeSections = selectedGrade?.sections || [];

  return (
    <>
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Student Name <span className="text-bad">*</span>
        </label>
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Full name"
          required
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          GR / Admission # <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={data.gr_number || ''}
          onChange={(e) => onChange('gr_number', e.target.value)}
          placeholder="Auto-assigned if blank"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink font-mono outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Roll Number <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="text"
          value={data.roll_no || ''}
          onChange={(e) => onChange('roll_no', e.target.value)}
          placeholder="e.g. 12"
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>

      {campuses.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
            Campus <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
          </label>
          <SearchableSelect
            options={campuses.map((c) => ({
              value: c._id,
              label: c.name,
              subtext: c.code ? `Code: ${c.code}` : ''
            }))}
            value={selectedCampusId || data.campus_id?._id || data.campus_id || ''}
            onChange={(val) => {
              if (onCampusChange) onCampusChange(val);
              onChange('campus_id', val);
            }}
            placeholder="Select Campus"
            searchPlaceholder="Search campus..."
            className="w-full"
          />
        </div>
      )}

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Class / Grade <span className="text-bad">*</span>
        </label>
        <SearchableSelect
          options={grades.map((g) => ({
            value: g._id,
            label: g.name,
            subtext: g.campus_id?.name ? `Campus: ${g.campus_id.name}` : (g.sections?.length ? `Sections: ${g.sections.join(', ')}` : '')
          }))}
          value={currentGradeId}
          onChange={(val) => {
            onChange('current_grade', val);
            const found = grades.find((g) => String(g._id) === String(val));
            if (found?.sections?.length && (!data.current_section || !found.sections.includes(data.current_section))) {
              onChange('current_section', found.sections[0]);
            }
          }}
          placeholder="Select Class / Grade"
          searchPlaceholder="Search class or grade..."
          className="w-full font-medium"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Section <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        {selectedGradeSections.length > 0 ? (
          <SearchableSelect
            options={selectedGradeSections.map((sec) => ({
              value: sec,
              label: `Section ${sec}`
            }))}
            value={data.current_section || 'A'}
            onChange={(val) => onChange('current_section', val)}
            placeholder="Select Section"
            searchPlaceholder="Search section..."
            className="w-full font-bold"
          />
        ) : (
          <input
            type="text"
            value={data.current_section || 'A'}
            onChange={(e) => onChange('current_section', e.target.value.toUpperCase())}
            placeholder="A, B, C..."
            className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary font-bold"
          />
        )}
      </div>

      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Date of Birth <span className="text-[10px] text-ink-faint font-normal normal-case">(optional)</span>
        </label>
        <input
          type="date"
          value={data.dob ? String(data.dob).slice(0, 10) : ''}
          onChange={(e) => onChange('dob', e.target.value)}
          className="w-full px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none focus:border-primary"
        />
      </div>
    </>
  );
};

export default StudentBioAcademicFieldsA;
