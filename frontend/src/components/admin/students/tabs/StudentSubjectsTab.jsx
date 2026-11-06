import { useState, useMemo } from 'react';
import { BookOpen, Search, CheckCheck, X, RotateCcw, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import StudentSubjectCard from '../cards/StudentSubjectCard';

const StudentSubjectsTab = ({
  subjects = [],
  selectedSubjectIds = [],
  onToggleSubject,
  onChange,
  currentGradeName = '',
  electiveStream = 'None',
  onResyncCurriculum,
  currentSection = 'A'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAllSubjects, setShowAllSubjects] = useState(false);

  const gradeSubjects = useMemo(() => {
    if (!currentGradeName) return subjects;
    const lowerName = currentGradeName.toLowerCase().trim();
    return subjects.filter((s) => {
      if (!s.classes || s.classes.length === 0) return true;
      return s.classes.some((c) => String(c).toLowerCase().trim() === lowerName);
    });
  }, [subjects, currentGradeName]);

  const enrolledSubjects = useMemo(() => {
    return subjects.filter((s) => selectedSubjectIds.includes(s._id));
  }, [subjects, selectedSubjectIds]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const match =
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code?.toLowerCase().includes(searchTerm.toLowerCase());
      if (!match) return false;
      if (filter === 'enrolled') return selectedSubjectIds.includes(s._id);
      if (filter === 'grade' && currentGradeName) {
        return !s.classes || s.classes.length === 0 || s.classes.some((c) => String(c).toLowerCase().trim() === currentGradeName.toLowerCase().trim());
      }
      if (filter === 'mandatory') return s.mandatory;
      if (filter === 'optional') return !s.mandatory;
      return true;
    });
  }, [subjects, searchTerm, filter, currentGradeName, selectedSubjectIds]);

  const filterOptions = [
    { id: 'all', label: 'All Subjects' },
    { id: 'enrolled', label: `Enrolled (${selectedSubjectIds.length})` },
    ...(currentGradeName ? [{ id: 'grade', label: `${currentGradeName} Only` }] : []),
    { id: 'mandatory', label: 'Mandatory' },
    { id: 'optional', label: 'Elective' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="p-4 rounded-xl bg-good/10 dark:bg-good/15 border border-good/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-good/20 text-good flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-ink dark:text-white">
                  Class Schedule & Curriculum Connected
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-good text-white">
                  Auto-Enrolled
                </span>
              </div>
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark mt-0.5">
                {currentGradeName
                  ? `Student is synchronized with ${currentGradeName} (Section ${currentSection}) timetable schedule.`
                  : 'Assign a Class to synchronize standard curriculum subjects automatically.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onResyncCurriculum && (
              <button
                type="button"
                onClick={onResyncCurriculum}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface dark:bg-[#141414] border border-good/30 text-good text-xs font-bold hover:bg-good/10 transition-colors cursor-pointer"
                title="Restore default curriculum subjects for this class"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-sync Schedule</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm flex-wrap">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Curriculum Subjects</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
              {selectedSubjectIds.length} Active Subjects
            </span>
            {electiveStream && electiveStream !== 'None' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent/15 text-accent border border-accent/20">
                {electiveStream}
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowAllSubjects((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                showAllSubjects
                  ? 'border-primary bg-primary-soft dark:bg-primary/20 text-primary font-bold'
                  : 'border-line dark:border-white/10 hover:bg-surface-secondary text-ink-sub'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAllSubjects ? 'Show Enrolled Only' : 'Customize / Browse All'}</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('subjects', gradeSubjects.map((s) => s._id))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark font-medium transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-good" />
              <span>All Class Subjects</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('subjects', [])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark font-medium transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-bad" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {showAllSubjects && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-line dark:border-white/10">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subjects by name or code..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#141414] text-xs text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-center flex-wrap gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilter(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    filter === opt.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink-sub hover:text-ink'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-ink dark:text-white px-1">
          <span>{showAllSubjects ? 'All Available Subjects' : 'Class Curriculum Enrolled Subjects'}</span>
          <span className="text-[11px] font-normal text-ink-muted">
            {showAllSubjects ? `${filteredSubjects.length} subjects found` : `${enrolledSubjects.length} subjects in student timetable`}
          </span>
        </div>

        {(showAllSubjects ? filteredSubjects : enrolledSubjects).length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-ink-muted mx-auto opacity-50" />
            <p className="text-xs font-semibold text-ink dark:text-white">No subjects enrolled yet</p>
            <p className="text-[11px] text-ink-muted max-w-sm mx-auto">
              Select a class in the Placement tab or click &apos;Customize / Browse All&apos; above to enroll subjects manually.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(showAllSubjects ? filteredSubjects : enrolledSubjects).map((sub) => {
              const isSelected = selectedSubjectIds.includes(sub._id);
              return (
                <StudentSubjectCard
                  key={sub._id}
                  subject={sub}
                  isSelected={isSelected}
                  onToggle={() => onToggleSubject(sub._id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectsTab;