import { useState } from 'react';
import { BookOpen, Search, CheckCheck, X, Layers } from 'lucide-react';
import StudentSubjectCard from '../cards/StudentSubjectCard';

const StudentSubjectsTab = ({
  subjects = [],
  selectedSubjectIds = [],
  onToggleSubject,
  onChange,
  currentGradeName = '',
  electiveStream = 'None'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredSubjects = subjects.filter((s) => {
    const match = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.code?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!match) return false;
    if (filter === 'grade' && currentGradeName) return !s.classes || s.classes.length === 0 || s.classes.includes(currentGradeName);
    if (filter === 'mandatory') return s.mandatory;
    if (filter === 'optional') return !s.mandatory;
    return true;
  });

  const handleAutoSelectForGrade = () => {
    if (!currentGradeName) return;
    const gradeSubjects = subjects.filter((s) => !s.classes || s.classes.length === 0 || s.classes.includes(currentGradeName));

    const selectedIds = gradeSubjects.filter((s) => {
      if (s.subject_type === 'Compulsory' || s.mandatory) return true;
      if (electiveStream === 'Science (Biology)') {
        return s.stream === 'Science (Biology)' || s.code === 'BIO' || s.name.toLowerCase().includes('bio');
      }
      if (electiveStream === 'Science (Computer)') {
        return s.stream === 'Science (Computer)' || s.code === 'CS' || s.name.toLowerCase().includes('computer');
      }
      if (electiveStream === 'Arts / Humanities') {
        return s.stream === 'Arts / Humanities' || s.name.toLowerCase().includes('arts');
      }
      return false;
    }).map((s) => s._id);

    onChange('subjects', selectedIds);
  };

  const filterOptions = [
    { id: 'all', label: 'All' },
    ...(currentGradeName ? [{ id: 'grade', label: currentGradeName }] : []),
    { id: 'mandatory', label: 'Mandatory' },
    { id: 'optional', label: 'Optional' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Subjects</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
              {selectedSubjectIds.length} Selected
            </span>
            {electiveStream && electiveStream !== 'None' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent/15 text-accent border border-accent/20">
                {electiveStream}
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {currentGradeName && (
              <button
                type="button"
                onClick={handleAutoSelectForGrade}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 text-primary dark:text-primary-dark hover:bg-primary-soft dark:hover:bg-primary/10 font-bold transition-colors cursor-pointer"
                title={`Auto-select ${electiveStream !== 'None' ? electiveStream : 'curriculum'} subjects for ${currentGradeName}`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Auto-Enroll for {currentGradeName}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange('subjects', subjects.map((s) => s._id))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark font-medium transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-good" />
              <span>Select All</span>
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

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSubjects.map((sub) => {
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
    </div>
  );
};

export default StudentSubjectsTab;
