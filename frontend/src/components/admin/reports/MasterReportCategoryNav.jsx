import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

const SUB_REPORTS = [
  { id: 'master_list', label: 'Student master list' },
  { id: 'registration_list', label: 'Registration list' },
  { id: 'new_admissions', label: 'New admissions' },
  { id: 'strength_summary', label: 'Student strength summary' },
  { id: 'dropout_left', label: 'Dropout / left students' },
  { id: 'birthday_list', label: 'Birthday list' },
  { id: 'siblings_report', label: 'Siblings report' },
  { id: 'free_students', label: 'Free Students List' }
];

const MasterReportCategoryNav = ({
  activeSubReport = 'master_list',
  onSelectSubReport,
  activeCategory = 'student',
  onSelectCategory
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [studentOpen, setStudentOpen] = useState(true);

  const filteredSubs = SUB_REPORTS.filter((s) => s.label.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-4 print:hidden">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-primary tracking-wider">
          <BookOpen size={14} />
          <span>Reports • 9 categories</span>
        </div>
        <div className="relative mt-2">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report category..."
            className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface text-ink placeholder:text-ink-muted outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
        <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
          <Sparkles size={11} /> Standalone Highlighted
        </span>
        <div className="flex flex-col gap-1">
          <Link to="/admin/reports/student-info" className="text-xs font-bold text-ink hover:text-primary transition-colors flex items-center justify-between">
            <span>Student Info Report</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary">Direct</span>
          </Link>
          <Link to="/admin/reports/parent-info" className="text-xs font-bold text-ink hover:text-primary transition-colors flex items-center justify-between">
            <span>Parent Contact Report</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600">Direct</span>
          </Link>
          <Link to="/admin/reports/report-cards" className="text-xs font-bold text-ink hover:text-primary transition-colors flex items-center justify-between">
            <span>Student Report Card</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600">Studio</span>
          </Link>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div>
          <button
            type="button"
            onClick={() => setStudentOpen((p) => !p)}
            className="w-full flex items-center justify-between p-2 rounded-xl font-black text-ink hover:bg-surface-secondary text-left transition-colors"
          >
            <span>Student Reports (12)</span>
            {studentOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
          {studentOpen && (
            <div className="pl-3 py-1 space-y-0.5 border-l-2 border-primary/30 ml-2">
              {filteredSubs.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    onSelectCategory('student');
                    onSelectSubReport(sub.id);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory === 'student' && activeSubReport === sub.id
                      ? 'bg-primary text-white font-bold'
                      : 'text-ink-sub hover:bg-surface-secondary hover:text-ink'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {['attendance', 'staff_attendance', 'exams', 'staff_hr', 'fee_finance'].map((catKey) => {
          const catLabels = {
            attendance: 'Attendance Reports',
            staff_attendance: 'Staff Attendance Reports',
            exams: 'Exam & Result Reports',
            staff_hr: 'Staff & HR Directory',
            fee_finance: 'Fee & Financial Reports'
          };
          const isAct = activeCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => onSelectCategory(catKey)}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-left font-bold transition-colors ${
                isAct ? 'bg-primary text-white font-black' : 'text-ink hover:bg-surface-secondary'
              }`}
            >
              <span>{catLabels[catKey]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MasterReportCategoryNav;
