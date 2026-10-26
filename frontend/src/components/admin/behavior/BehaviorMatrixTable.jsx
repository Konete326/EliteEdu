import { useState, useMemo } from 'react';
import { Users, RotateCw, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import BehaviorMatrixRow from './BehaviorMatrixRow';

const BehaviorMatrixTable = ({
  students = [],
  evaluations = {},
  onChangeRating,
  onChangeConduct,
  onChangeObservation,
  onQuickRateStudent,
  onViewReportCard,
  loading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainView, setDomainView] = useState('all');

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase().trim();
    return students.filter(({ student }) => {
      const name = (student.name || '').toLowerCase();
      const roll = String(student.roll_number || '').toLowerCase();
      const gr = String(student.gr_number || '').toLowerCase();
      return name.includes(q) || roll.includes(q) || gr.includes(q);
    });
  }, [students, searchQuery]);

  const showAffective = domainView === 'all' || domainView === 'affective';
  const showPsychomotor = domainView === 'all' || domainView === 'psychomotor';

  if (loading) {
    return (
      <div className="bg-surface dark:bg-surface-dark p-12 rounded-2xl border border-line dark:border-line-dark shadow-2xs text-center space-y-3 h-full flex flex-col items-center justify-center">
        <RotateCw className="w-7 h-7 text-primary animate-spin" />
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-semibold">Loading student roster and behavior evaluations...</p>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="bg-surface dark:bg-surface-dark p-12 rounded-2xl border border-line dark:border-line-dark shadow-2xs text-center space-y-2 h-full flex flex-col items-center justify-center">
        <Users className="w-8 h-8 text-ink-muted dark:text-ink-muted-dark" />
        <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No active students found in this class/section</h4>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Please select another class or section from the filter panel.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-2xs flex flex-col h-full min-h-0 overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-line dark:border-line-dark flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-soft text-primary dark:text-primary-dark">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ink dark:text-ink-dark">Evaluation Matrix Roster</h3>
            <p className="text-[10px] text-ink-muted dark:text-ink-muted-dark font-medium">
              Showing {filteredStudents.length} of {students.length} students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary shrink-0" />
            <select
              value={domainView}
              onChange={(e) => setDomainView(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark font-bold text-xs focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
            >
              <option value="all">View: All Skills Matrix (10 Domains)</option>
              <option value="affective">View: Affective Domain Only (5 Skills)</option>
              <option value="psychomotor">View: Psychomotor Domain Only (5 Skills)</option>
              <option value="conduct">View: Conduct &amp; Remarks Only</option>
            </select>
          </div>

          <div className="relative min-w-[170px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-ink-muted-dark" />
            <input
              type="text"
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-surface dark:bg-surface-dark shadow-2xs border-b border-line dark:border-line-dark">
            <tr className="bg-surface-secondary/80 dark:bg-surface-secondary-dark/80 text-ink-muted dark:text-ink-muted-dark text-[10px] uppercase tracking-wider font-black border-b border-line/60 dark:border-line-dark/60">
              <th className="p-2 text-center w-10">Roll</th>
              <th className="p-2 min-w-[140px] max-w-[180px]">Student Details</th>
              <th className="p-2 text-center w-24 border-l border-line dark:border-line-dark">Quick Rate</th>
              {showAffective && (
                <th colSpan="5" className="p-1.5 text-center bg-primary-soft/40 dark:bg-primary/10 text-primary dark:text-primary-dark border-l border-primary/20">
                  Affective Domain (Character &amp; Values: 1-5)
                </th>
              )}
              {showPsychomotor && (
                <th colSpan="5" className="p-1.5 text-center bg-accent-soft/50 dark:bg-accent/10 text-accent-ink dark:text-accent-dark border-l border-accent/20">
                  Psychomotor Domain (Practical Skills: 1-5)
                </th>
              )}
              <th className="p-2 text-center border-l border-line dark:border-line-dark min-w-[115px]">Conduct</th>
              <th className="p-2 border-l border-line dark:border-line-dark min-w-[150px]">Observation</th>
              <th className="p-2 text-center border-l border-line dark:border-line-dark w-10">Report</th>
            </tr>
            <tr className="bg-surface dark:bg-surface-dark text-ink-muted dark:text-ink-muted-dark text-[10px] font-bold border-b border-line dark:border-line-dark">
              <th className="p-1 text-center" />
              <th className="p-1" />
              <th className="p-1 border-l border-line/50 dark:border-line-dark/50" />
              {showAffective && (
                <>
                  <th className="p-1 text-center border-l border-line/50 dark:border-line-dark/50 font-semibold w-14">Punctual</th>
                  <th className="p-1 text-center border-l border-line/50 dark:border-line-dark/50 font-semibold w-14">Discipline</th>
                  <th className="p-1 text-center border-l border-line/50 dark:border-line-dark/50 font-semibold w-14">Neatness</th>
                  <th className="p-1 text-center border-l border-line/50 dark:border-line-dark/50 font-semibold w-14">Obedience</th>
                  <th className="p-1 text-center border-l border-line/50 dark:border-line-dark/50 font-semibold w-14">Teamwork</th>
                </>
              )}
              {showPsychomotor && (
                <>
                  <th className="p-1 text-center border-l border-accent/20 dark:border-accent/15 font-semibold w-14">Writing</th>
                  <th className="p-1 text-center border-l border-accent/20 dark:border-accent/15 font-semibold w-14">Speech</th>
                  <th className="p-1 text-center border-l border-accent/20 dark:border-accent/15 font-semibold w-14">Sports</th>
                  <th className="p-1 text-center border-l border-accent/20 dark:border-accent/15 font-semibold w-14">Creativity</th>
                  <th className="p-1 text-center border-l border-accent/20 dark:border-accent/15 font-semibold w-14">Computer</th>
                </>
              )}
              <th className="p-1 border-l border-line dark:border-line-dark" />
              <th className="p-1 border-l border-line dark:border-line-dark" />
              <th className="p-1 border-l border-line dark:border-line-dark" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60 dark:divide-line-dark/60">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(({ student }) => (
                <BehaviorMatrixRow
                  key={student._id}
                  student={student}
                  evaluation={evaluations[student._id] || {}}
                  domainView={domainView}
                  onChangeRating={(domain, key, val) => onChangeRating(student._id, domain, key, val)}
                  onChangeConduct={(val) => onChangeConduct(student._id, val)}
                  onChangeObservation={(val) => onChangeObservation(student._id, val)}
                  onQuickRateStudent={onQuickRateStudent}
                  onViewReportCard={onViewReportCard}
                />
              ))
            ) : (
              <tr>
                <td colSpan={showAffective && showPsychomotor ? 16 : 11} className="py-8 text-center text-xs text-ink-muted dark:text-ink-muted-dark">
                  No students matched &quot;{searchQuery}&quot;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BehaviorMatrixTable;
