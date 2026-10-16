import { Calendar, GraduationCap, Sparkles } from 'lucide-react';
import AttendanceStatsCard from './AttendanceStatsCard';

const AttendanceControlDock = ({
  date, setDate,
  grades = [], selectedGradeId, setSelectedGradeId,
  sections = [], selectedSection, setSelectedSection,
  summary = {}, totalStudents = 0, loading = false
}) => {
  const setQuickDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    setDate(d.toISOString().slice(0, 10));
  };

  const selectedGrade = grades.find((g) => g._id === selectedGradeId);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-xs space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>Attendance Date *</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted hover:text-ink transition-all cursor-pointer"
              >
                Yesterday
              </button>
            </div>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>Assigned Class / Grade *</span>
          </label>
          <select
            value={selectedGradeId}
            onChange={(e) => setSelectedGradeId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-medium bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
          >
            <option value="">-- Select Class --</option>
            {grades.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} {g.class_teacher?.name ? `• ${g.class_teacher.name}` : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedGrade && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink dark:text-ink-dark flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Section</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSection('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSection === 'ALL'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark'
                }`}
              >
                All Sections
              </button>
              {(sections.length > 0 ? sections : ['A', 'B', 'C']).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedSection === sec
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark'
                  }`}
                >
                  Sec {sec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AttendanceStatsCard summary={summary} total={totalStudents} />
    </div>
  );
};

export default AttendanceControlDock;
