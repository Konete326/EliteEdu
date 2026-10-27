import { useState, useMemo } from 'react';
import { Users, RotateCw, Search, ShieldCheck, Sparkles, Filter, LayoutGrid, Table as TableIcon } from 'lucide-react';
import BehaviorStudentCard from './BehaviorStudentCard';
import BehaviorEvaluationModal from './BehaviorEvaluationModal';
import BehaviorMatrixRow from './BehaviorMatrixRow';

export default function BehaviorMatrixTable({
  students = [],
  evaluations = {},
  onChangeRating,
  onChangeConduct,
  onChangeObservation,
  onQuickRateStudent,
  onSaveSingleStudent,
  onSaveAll,
  onViewReportCard,
  loading
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [conductFilter, setConductFilter] = useState('All');
  const [activeModalStudent, setActiveModalStudent] = useState(null);
  const [viewMode, setViewMode] = useState('cards');

  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return students.filter(({ student }) => {
      const name = (student.name || '').toLowerCase();
      const roll = String(student.roll_number || '').toLowerCase();
      const gr = String(student.gr_number || '').toLowerCase();
      const matchQ = !q || name.includes(q) || roll.includes(q) || gr.includes(q);

      const ev = evaluations[student._id];
      const cond = ev?.general_conduct || 'Good';
      const matchConduct = conductFilter === 'All' || cond === conductFilter;

      return matchQ && matchConduct;
    });
  }, [students, evaluations, searchQuery, conductFilter]);

  const handleModalSave = async (studentId, payload) => {
    if (onSaveSingleStudent) {
      return onSaveSingleStudent(studentId, payload);
    }
    if (payload.general_conduct && onChangeConduct) {
      onChangeConduct(studentId, payload.general_conduct);
    }
    if (payload.teacher_observation !== undefined && onChangeObservation) {
      onChangeObservation(studentId, payload.teacher_observation);
    }
    if (payload.affective_ratings && onChangeRating) {
      Object.entries(payload.affective_ratings).forEach(([k, v]) => {
        onChangeRating(studentId, 'affective', k, v);
      });
    }
    if (payload.psychomotor_ratings && onChangeRating) {
      Object.entries(payload.psychomotor_ratings).forEach(([k, v]) => {
        onChangeRating(studentId, 'psychomotor', k, v);
      });
    }
    return true;
  };

  if (loading) {
    return (
      <div className="bg-surface dark:bg-surface-dark p-12 rounded-2xl border border-line dark:border-line-dark shadow-2xs text-center space-y-3 h-full flex flex-col items-center justify-center">
        <RotateCw className="w-7 h-7 text-primary animate-spin" />
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-semibold">Loading students and behavior assessments...</p>
      </div>
    );
  }

  if (!students.length) {
    return (
      <div className="bg-surface dark:bg-surface-dark p-12 rounded-2xl border border-line dark:border-line-dark shadow-2xs text-center space-y-2 h-full flex flex-col items-center justify-center">
        <Users className="w-8 h-8 text-ink-muted dark:text-ink-muted-dark" />
        <h4 className="text-sm font-bold text-ink dark:text-ink-dark">No active students in this class/section</h4>
        <p className="text-xs text-ink-muted dark:text-ink-muted-dark">Please select another class or section from the filter sidebar.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark shadow-2xs flex flex-col h-full min-h-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-line dark:border-line-dark flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-ink dark:text-ink-dark tracking-tight">Student Behavior Assessment Cards</h3>
            <p className="text-[10px] text-ink-muted font-medium">
              Showing {filteredStudents.length} of {students.length} students • One-click rating enabled
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-0.5 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark text-xs">
            {['All', 'Exemplary', 'Good', 'Satisfactory', 'Needs Improvement'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setConductFilter(c)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  conductFilter === c
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {c === 'Needs Improvement' ? 'Needs Attention' : c}
              </button>
            ))}
          </div>

          <div className="relative min-w-[160px] sm:min-w-[190px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line dark:border-line-dark bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark placeholder:text-ink-muted/50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="inline-flex p-0.5 rounded-xl bg-surface-secondary dark:bg-white/5 border border-line dark:border-line-dark">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              title="Cards Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <LayoutGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              title="Matrix Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <TableIcon size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
            {filteredStudents.map(({ student }) => (
              <BehaviorStudentCard
                key={student._id}
                student={student}
                evaluation={evaluations[student._id]}
                onQuickRate={onQuickRateStudent}
                onOpenModal={(st) => setActiveModalStudent(st)}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-secondary/80 dark:bg-surface-secondary-dark/80 text-ink-muted text-[10px] uppercase tracking-wider font-black border-b border-line dark:border-line-dark">
                  <th className="p-2.5 text-center w-12">Roll</th>
                  <th className="p-2.5 min-w-[140px]">Student Details</th>
                  <th className="p-2.5 text-center w-28">Quick Rate</th>
                  <th className="p-2.5 min-w-[140px]">Conduct</th>
                  <th className="p-2.5 min-w-[180px]">Remarks &amp; Feedback</th>
                  <th className="p-2.5 text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 dark:divide-line-dark/60">
                {filteredStudents.map(({ student }) => (
                  <BehaviorMatrixRow
                    key={student._id}
                    student={student}
                    evaluation={evaluations[student._id] || {}}
                    onChangeRating={onChangeRating}
                    onChangeConduct={onChangeConduct}
                    onChangeObservation={onChangeObservation}
                    onQuickRateStudent={onQuickRateStudent}
                    onViewReportCard={onViewReportCard}
                    showAffective={true}
                    showPsychomotor={true}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BehaviorEvaluationModal
        isOpen={Boolean(activeModalStudent)}
        onClose={() => setActiveModalStudent(null)}
        student={activeModalStudent}
        evaluation={activeModalStudent ? evaluations[activeModalStudent._id] : null}
        onSave={handleModalSave}
      />
    </div>
  );
}
