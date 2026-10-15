import { useState } from 'react';
import { BookOpen, Search, CheckCheck, X } from 'lucide-react';
import StudentSubjectCard from '../cards/StudentSubjectCard';

const StudentSubjectsTab = ({ subjects, selectedSubjectIds, onToggleSubject, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'mandatory') return s.mandatory;
    if (filter === 'optional') return !s.mandatory;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Enrolled Subjects & Curriculum</span>
            <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft dark:bg-primary/20 text-primary dark:text-primary-dark">
              {selectedSubjectIds.length} Selected
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => onChange('subjects', subjects.map((s) => s._id))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark font-medium transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-good" />
              <span>Select All</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('subjects', [])}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-line dark:border-white/10 hover:bg-surface-secondary dark:hover:bg-white/10 text-ink dark:text-ink-dark font-medium transition-colors"
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
          <div className="flex items-center gap-1.5">
            {['all', 'mandatory', 'optional'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  filter === type
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-secondary/50 dark:bg-[#141414] border border-line dark:border-white/10 text-ink-sub hover:text-ink'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredSubjects.length === 0 ? (
          <p className="text-xs text-ink-muted text-center py-6">
            No subjects found matching your criteria. Ensure subjects are added in Subjects Management.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {filteredSubjects.map((sub) => (
              <StudentSubjectCard
                key={sub._id}
                sub={sub}
                isSelected={selectedSubjectIds.includes(sub._id)}
                onToggle={onToggleSubject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectsTab;
