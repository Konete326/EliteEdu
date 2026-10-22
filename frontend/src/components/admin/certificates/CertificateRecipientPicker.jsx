import React, { useState, useMemo } from 'react';
import { User, Users, GraduationCap, Briefcase, Search, Check, RefreshCw } from 'lucide-react';

const CertificateRecipientPicker = ({
  form = {},
  students = [],
  teachers = [],
  onChange
}) => {
  const isStudent = form.recipient_type === 'Student';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [isSelecting, setIsSelecting] = useState(!form.recipient_id);

  const availableGrades = useMemo(() => {
    if (!isStudent) return [];
    const gradesMap = new Map();
    students.forEach((s) => {
      const g = s.current_grade;
      if (g && (g.name || typeof g === 'string')) {
        const id = g._id || g;
        const name = g.name || g;
        if (!gradesMap.has(id)) {
          gradesMap.set(id, { id, name });
        }
      }
    });
    return Array.from(gradesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [students, isStudent]);

  const filteredList = useMemo(() => {
    const list = isStudent ? students : teachers;
    const term = searchTerm.toLowerCase().trim();

    return list.filter((item) => {
      if (isStudent && selectedGrade !== 'all') {
        const gId = item.current_grade?._id || item.current_grade;
        if (gId !== selectedGrade) return false;
      }
      if (!term) return true;
      const name = (item.name || '').toLowerCase();
      const father = (item.father_name || '').toLowerCase();
      const gr = String(item.gr_number || '').toLowerCase();
      const code = String(item.employee_code || item.personal_id || '').toLowerCase();
      const desig = (item.designation || '').toLowerCase();

      return (
        name.includes(term) ||
        father.includes(term) ||
        gr.includes(term) ||
        code.includes(term) ||
        desig.includes(term)
      );
    });
  }, [isStudent, students, teachers, searchTerm, selectedGrade]);

  const currentRecipient = useMemo(() => {
    const list = isStudent ? students : teachers;
    return list.find((r) => r._id === form.recipient_id) || null;
  }, [isStudent, students, teachers, form.recipient_id]);

  const handleSelect = (r) => {
    onChange('recipient_id', r._id);
    setIsSelecting(false);
  };

  const handleTypeChange = (type) => {
    onChange('recipient_type', type);
    onChange('recipient_id', '');
    setSearchTerm('');
    setSelectedGrade('all');
    setIsSelecting(true);
  };

  return (
    <div className="space-y-2.5">
      <div>
        <label className="block text-[11px] font-bold text-ink-muted uppercase mb-1">
          Recipient Type *
        </label>
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface-secondary/50 border border-line dark:border-line-dark">
          <button
            type="button"
            onClick={() => handleTypeChange('Student')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isStudent
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-muted hover:text-ink hover:bg-surface/50'
            }`}
          >
            <GraduationCap size={14} />
            <span>Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('Staff')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isStudent
                ? 'bg-primary text-white shadow-2xs'
                : 'text-ink-muted hover:text-ink hover:bg-surface/50'
            }`}
          >
            <Briefcase size={14} />
            <span>Staff / Teacher</span>
          </button>
        </div>
      </div>

      {!isSelecting && currentRecipient ? (
        <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentRecipient.photo_url ? (
              <img
                src={currentRecipient.photo_url}
                alt={currentRecipient.name}
                className="w-10 h-10 rounded-full object-cover border border-primary/30 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {(currentRecipient.name || 'U')
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-ink dark:text-ink-dark text-xs truncate">
                {currentRecipient.name}
              </h4>
              <p className="text-[10px] text-ink-muted truncate">
                {isStudent
                  ? `S/D: ${currentRecipient.father_name || '—'} • GR: ${currentRecipient.gr_number || '—'} • ${currentRecipient.current_grade?.name || 'Class'} (${currentRecipient.current_section || 'A'})`
                  : `${currentRecipient.designation || 'Staff'} • Code: ${currentRecipient.employee_code || '—'}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSelecting(true)}
            className="px-2.5 py-1 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-[11px] font-bold text-primary shrink-0 transition-colors cursor-pointer"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="space-y-2 p-2.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/20">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-ink-muted uppercase">
              Choose {isStudent ? 'Student' : 'Staff Member'} *
            </span>
            {currentRecipient && (
              <button
                type="button"
                onClick={() => setIsSelecting(false)}
                className="text-[10px] font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Keep Current
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2.5 top-2.5 text-ink-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isStudent ? 'Search name or GR #...' : 'Search staff or code...'}
                className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-line bg-surface dark:bg-surface-dark text-xs font-medium placeholder:text-ink-muted/60"
              />
            </div>
            {isStudent && availableGrades.length > 0 && (
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="px-2 py-1.5 rounded-lg border border-line bg-surface dark:bg-surface-dark text-xs font-semibold max-w-[110px]"
              >
                <option value="all">All Grades</option>
                {availableGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="max-h-44 overflow-y-auto space-y-1 pr-1 divide-y divide-line/40">
            {filteredList.length === 0 ? (
              <div className="py-4 text-center text-xs text-ink-muted">
                No matching {isStudent ? 'students' : 'staff members'} found.
              </div>
            ) : (
              filteredList.map((r) => {
                const isCurrent = r._id === form.recipient_id;
                return (
                  <button
                    key={r._id}
                    type="button"
                    onClick={() => handleSelect(r)}
                    className={`w-full text-left p-1.5 rounded-lg transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'hover:bg-surface-secondary/70 text-ink'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{r.name}</div>
                      <div className="text-[10px] text-ink-muted truncate">
                        {isStudent
                          ? `GR: ${r.gr_number || '—'} • ${r.current_grade?.name || 'Class'} (${r.current_section || 'A'}) • S/D: ${r.father_name || '—'}`
                          : `${r.designation || 'Staff'} • Code: ${r.employee_code || '—'}`}
                      </div>
                    </div>
                    {isCurrent && <Check size={14} className="text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateRecipientPicker;