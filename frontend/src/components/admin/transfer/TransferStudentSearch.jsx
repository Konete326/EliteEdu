import { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, X, Building2, GraduationCap } from 'lucide-react';

const TransferStudentSearch = ({ students = [], selectedStudent, onSelectStudent, onClearStudent }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? students.filter((s) => {
        const q = query.toLowerCase();
        const name = (s.name || '').toLowerCase();
        const gr = (s.gr_number || '').toLowerCase();
        const roll = (s.roll_number || '').toLowerCase();
        return name.includes(q) || gr.includes(q) || roll.includes(q);
      }).slice(0, 10)
    : students.slice(0, 8);

  const handleSelect = (student) => {
    onSelectStudent(student);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="block text-xs font-bold text-ink dark:text-ink-dark">
        Select Student to Relocate <span className="text-bad">*</span>
      </label>

      {selectedStudent ? (
        <div className="p-3.5 rounded-xl bg-surface-secondary/50 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-ink dark:text-ink-dark text-xs">{selectedStudent.name}</span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-mono font-bold">
                  GR: {selectedStudent.gr_number || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-ink-muted mt-0.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-primary" /> {selectedStudent.campus_id?.name || 'Main Campus'}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-primary" /> {selectedStudent.current_grade?.name || selectedStudent.grade_id?.name || 'Grade'} - {selectedStudent.current_section || selectedStudent.section || 'A'}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearStudent}
            className="p-1 rounded-lg text-ink-muted hover:text-bad hover:bg-bad-soft/40 transition-colors"
            title="Change Student"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Type name, GR number, or roll no for suggestions..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-56 overflow-y-auto rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] shadow-xl divide-y divide-line dark:divide-white/5">
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-xs text-ink-muted">
                  No matching student found for "{query}".
                </div>
              ) : (
                filtered.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleSelect(s)}
                    className="w-full p-2.5 text-left hover:bg-primary-soft/50 dark:hover:bg-primary/10 transition-colors flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-xs text-ink dark:text-ink-dark">{s.name}</div>
                      <div className="text-[10px] text-ink-muted font-mono">
                        GR: {s.gr_number || 'N/A'} {s.roll_number ? `• Roll: ${s.roll_number}` : ''}
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-ink-muted">
                      <div className="font-semibold text-primary">{s.campus_id?.name || 'Main Campus'}</div>
                      <div>{s.current_grade?.name || s.grade_id?.name || 'Grade'} ({s.current_section || s.section || 'A'})</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransferStudentSearch;
