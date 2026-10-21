import { useMemo } from 'react';
import { School, Layers, Check } from 'lucide-react';
import SearchableSelect from '../../../common/SearchableSelect';

const ELECTIVE_STREAMS = [
  {
    id: 'Science (Biology)',
    title: 'Science (Biology Group)',
    desc: 'Pre-Medical track with Biology, Chemistry, and Physics'
  },
  {
    id: 'Science (Computer)',
    title: 'Science (Computer Science Group)',
    desc: 'ICS / Technology track with Computer Science, Chemistry, and Physics'
  },
  {
    id: 'Arts / Humanities',
    title: 'Arts & Humanities Group',
    desc: 'General arts curriculum with General Science and Electives'
  }
];

const StudentPlacementCard = ({ formData, campuses = [], grades = [], onChange }) => {
  const campusGrades = useMemo(() => {
    return grades.filter((g) => {
      if (!formData.campus_id) return true;
      const gCampId = g.campus_id?._id || g.campus_id;
      return !gCampId || gCampId === formData.campus_id;
    });
  }, [grades, formData.campus_id]);

  const campusOptions = useMemo(() => [
    { value: '', label: 'Main / First Active Campus' },
    ...campuses.map((c) => ({ value: c._id, label: c.name }))
  ], [campuses]);

  const gradeOptions = useMemo(() => [
    { value: '', label: 'Select Class' },
    ...campusGrades.map((g) => ({ value: g._id, label: g.name }))
  ], [campusGrades]);

  const admittedGrade = grades.find((g) => g._id === formData.grade_admitted);
  const currentGrade = grades.find((g) => g._id === formData.current_grade);
  const admittedSections = admittedGrade?.sections || ['A', 'B', 'C', 'D'];
  const currentSections = currentGrade?.sections || ['A', 'B', 'C', 'D'];

  const selectedGradeObj = currentGrade || admittedGrade;
  const gradeName = selectedGradeObj?.name || '';
  const isHighSchool = /\b(9|10|matric|o[-\s]?level|inter|hssc|11|12)\b/i.test(gradeName);

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
      <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
        <School className="w-4 h-4 text-primary" />
        <span>Academic Placement & Class Enrollment</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
        <div>
          <label className="block font-semibold text-ink dark:text-white mb-1">
            Campus Branch
          </label>
          <SearchableSelect
            options={campusOptions}
            value={formData.campus_id || ''}
            onChange={(val) => onChange('campus_id', val)}
            placeholder="Select Campus..."
            size="sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink dark:text-white mb-1">
            Class Admitted
          </label>
          <SearchableSelect
            options={gradeOptions}
            value={formData.grade_admitted || ''}
            onChange={(val) => {
              onChange('grade_admitted', val);
              if (!formData.current_grade) onChange('current_grade', val);
            }}
            placeholder="Select Class..."
            size="sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink dark:text-white mb-1">
            Section Admitted
          </label>
          <SearchableSelect
            options={admittedSections.map((s) => ({ value: s, label: `Section ${s}` }))}
            value={formData.section_admitted || 'A'}
            onChange={(val) => onChange('section_admitted', val)}
            searchable={false}
            size="sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink dark:text-white mb-1">
            Current Class
          </label>
          <SearchableSelect
            options={gradeOptions}
            value={formData.current_grade || ''}
            onChange={(val) => onChange('current_grade', val)}
            placeholder="Select Current Class..."
            size="sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-ink dark:text-white mb-1">
            Current Section
          </label>
          <SearchableSelect
            options={currentSections.map((s) => ({ value: s, label: `Section ${s}` }))}
            value={formData.current_section || 'A'}
            onChange={(val) => onChange('current_section', val)}
            searchable={false}
            size="sm"
          />
        </div>
      </div>

      {isHighSchool && (
        <div className="p-4 rounded-xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
              <Layers size={14} />
              <span>Subject Group ({gradeName})</span>
            </div>
            <span className="text-[10px] text-ink-muted">
              Choose Biology, Computer, or Arts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {ELECTIVE_STREAMS.map((st) => {
              const isSelected = formData.elective_stream === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChange('elective_stream', isSelected ? 'None' : st.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-accent bg-accent/10 dark:bg-accent/20 text-accent font-bold shadow-2xs'
                      : 'border-line dark:border-line-dark bg-surface dark:bg-[#141414] text-ink-muted hover:border-line-dark'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-xs font-bold text-ink dark:text-white">{st.title}</p>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-accent bg-accent text-white'
                          : 'border-line dark:border-line-dark'
                      }`}
                    >
                      {isSelected && <Check size={10} />}
                    </div>
                  </div>
                  <p className="text-[10px] text-ink-muted mt-1 leading-tight">{st.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPlacementCard;
