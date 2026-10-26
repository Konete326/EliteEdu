import { useState, useMemo, useRef, useEffect } from 'react';
import { Eye, Search, X, Check, ChevronsUpDown } from 'lucide-react';

const StudentSwitcherBar = ({ isStaff, students = [], selectedStudentId, onSelectStudent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentStudent = useMemo(() => (
    students.find((s) => s._id === selectedStudentId)
  ), [students, selectedStudentId]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter((st) => {
      const name = (st.name || '').toLowerCase();
      const gr = String(st.gr_number || '').toLowerCase();
      const grade = (st.current_grade?.name || '').toLowerCase();
      const father = (st.father_name || '').toLowerCase();
      return name.includes(q) || gr.includes(q) || grade.includes(q) || father.includes(q);
    });
  }, [students, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isStaff) return null;

  return (
    <div ref={dropdownRef} className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark p-3 sm:px-4 sm:py-2.5 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
      <div className="flex items-center gap-2.5">
        <div className="px-2.5 py-1 rounded-xl bg-accent-soft text-accent-ink dark:bg-accent/15 dark:text-accent-dark font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 border border-accent/20 shrink-0">
          <Eye className="w-3.5 h-3.5 text-accent-ink dark:text-accent-dark" />
          <span>Simulation Mode</span>
        </div>
        <span className="text-xs text-ink-muted dark:text-ink-muted-dark hidden md:inline font-medium">
          Previewing student portal &amp; real-time academic view
        </span>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (!isOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
          }}
          className="w-full sm:w-auto min-w-[240px] sm:min-w-[280px] max-w-full sm:max-w-[340px] px-3 py-1.5 rounded-xl bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark text-xs font-bold flex items-center justify-between gap-2 shadow-2xs hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded-full bg-primary-soft text-primary dark:text-primary-dark font-black text-[10px] flex items-center justify-center shrink-0">
              {currentStudent?.name?.charAt(0) || 'S'}
            </div>
            <span className="truncate font-semibold">
              {currentStudent ? `${currentStudent.name} (${currentStudent.gr_number || '—'})` : 'Select Student...'}
            </span>
            {currentStudent?.current_grade?.name && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface dark:bg-surface-dark border border-line/60 dark:border-line-dark/60 text-ink-muted dark:text-ink-muted-dark shrink-0">
                {currentStudent.current_grade.name}
              </span>
            )}
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-ink-muted dark:text-ink-muted-dark shrink-0" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-full sm:w-[340px] z-50 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-xl p-2 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by name, GR #, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/50 focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-ink-muted hover:text-ink"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => {
                  const isSelected = st._id === selectedStudentId;
                  return (
                    <button
                      key={st._id}
                      type="button"
                      onClick={() => {
                        onSelectStudent(st._id);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors ${
                        isSelected
                          ? 'bg-primary-soft text-primary dark:text-primary-dark font-bold'
                          : 'hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark text-ink dark:text-ink-dark'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line/60 dark:border-line-dark/60 text-ink-muted dark:text-ink-muted-dark font-bold text-[10px] flex items-center justify-center shrink-0">
                          {st.name?.charAt(0) || 'S'}
                        </div>
                        <div className="truncate">
                          <div className="font-bold truncate">{st.name}</div>
                          <div className="text-[10px] text-ink-muted dark:text-ink-muted-dark">
                            GR: {st.gr_number || '—'} {st.current_grade?.name ? `• ${st.current_grade.name}` : ''}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-ink-muted dark:text-ink-muted-dark">
                  No students match &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSwitcherBar;
