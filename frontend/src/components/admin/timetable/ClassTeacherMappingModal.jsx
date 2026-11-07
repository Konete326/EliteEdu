import { useState, useEffect } from 'react';
import { X, Zap, Loader2, AlertCircle, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import SearchableSelect from '../../common/SearchableSelect';

const ClassTeacherMappingModal = ({
  open,
  onClose,
  selectedGrade,
  selectedSection = 'A',
  grades = [],
  teachers = [],
  onGenerated
}) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gradeName, setGradeName] = useState('');
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (!open || !selectedGrade) return;
    setLoading(true);
    api
      .get(`/timetable/class-assignments?grade_id=${selectedGrade}&section=${selectedSection}`)
      .then((res) => {
        setGradeName(res.data?.grade_name || '');
        const list = res.data?.assignments || [];
        setAssignments(
          list.map((item) => ({
            subject_id: item.subject_id,
            subject_name: item.subject_name,
            subject_code: item.subject_code,
            subject_type: item.subject_type || 'Compulsory',
            periods_per_week: item.periods_per_week || 5,
            teacher_id: item.teacher_id || ''
          }))
        );
      })
      .catch(() => {
        showToast('Failed to load class subjects', 'error');
      })
      .finally(() => setLoading(false));
  }, [open, selectedGrade, selectedSection]);

  if (!open) return null;

  const currentGradeObj = grades.find((g) => g._id === selectedGrade);
  const displayClassName = gradeName || currentGradeObj?.name || 'Selected Class';

  const handleTeacherChange = (subjectId, teacherId) => {
    setAssignments((prev) =>
      prev.map((item) => (item.subject_id === subjectId ? { ...item, teacher_id: teacherId } : item))
    );
  };

  const handlePeriodsChange = (subjectId, val) => {
    const num = Math.max(1, Math.min(10, parseInt(val, 10) || 1));
    setAssignments((prev) =>
      prev.map((item) => (item.subject_id === subjectId ? { ...item, periods_per_week: num } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = assignments.filter((a) => !a.teacher_id);
    if (missing.length > 0) {
      showToast(`Please assign teachers for all subjects (${missing.length} unassigned)`, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        grade_id: selectedGrade,
        section: selectedSection,
        assignments: assignments.map((a) => ({
          subject_id: a.subject_id,
          teacher_id: a.teacher_id,
          periods_per_week: a.periods_per_week
        }))
      };

      const res = await api.post('/timetable/auto-generate', payload);
      showToast(res.data?.message || 'Timetable auto-generated successfully!', 'success');
      onGenerated?.();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to auto-generate timetable', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const teacherOptions = teachers.map((t) => ({
    value: t._id,
    label: t.name,
    subtext: t.designation || t.email || '',
    badge: t.campus_id?.name || ''
  }));

  const missingCount = assignments.filter((a) => !a.teacher_id).length;
  const allAssigned = assignments.length > 0 && missingCount === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-line dark:border-line-dark flex items-start justify-between gap-3 shrink-0 bg-surface dark:bg-surface-dark">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold tracking-tight mb-1">
              <Zap className="w-3 h-3 text-primary" /> Auto-Scheduler
            </div>
            <h2 className="text-base font-bold text-ink dark:text-ink-dark tracking-tight">
              Class Routine: {displayClassName} ({selectedSection})
            </h2>
            <p className="text-xs text-ink-muted">
              Select teachers for curriculum subjects. The engine automatically distributes periods and prevents teacher timetable clashes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-ink-muted">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <span className="text-xs font-semibold">Loading class curriculum...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <AlertCircle className="w-9 h-9 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-ink dark:text-ink-dark">No Subjects Found</h3>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Please make sure subjects are assigned to {displayClassName} in Subjects setup.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="p-5 overflow-y-auto flex-1 min-h-0 space-y-3">
              <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider px-1 flex items-center justify-between">
                <span>Subject &amp; Code</span>
                <span className="pr-24">Assigned Teacher</span>
                <span>Periods / Week</span>
              </div>

              <div className="divide-y divide-line dark:divide-line-dark border border-line dark:border-line-dark rounded-xl overflow-hidden bg-surface-secondary/20">
                {assignments.map((item) => (
                  <div
                    key={item.subject_id}
                    className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-[190px]">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-ink dark:text-ink-dark truncate">
                          {item.subject_name}
                        </div>
                        <div className="text-[10px] text-ink-muted font-mono flex items-center gap-1.5">
                          <span>{item.subject_code}</span>
                          <span>•</span>
                          <span>{item.subject_type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1 min-w-[200px]">
                        <SearchableSelect
                          options={teacherOptions}
                          value={item.teacher_id}
                          onChange={(val) => handleTeacherChange(item.subject_id, val)}
                          placeholder="Select Teacher..."
                          searchPlaceholder="Search teacher..."
                          size="sm"
                        />
                      </div>
                      <div className="w-20 shrink-0 flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.periods_per_week}
                          onChange={(e) => handlePeriodsChange(item.subject_id, e.target.value)}
                          className="w-full px-2 py-1 text-center text-xs font-bold border border-line dark:border-line-dark rounded-lg bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark focus:outline-hidden focus:ring-1 focus:ring-primary"
                          title="Periods per week"
                        />
                        <span className="text-[10px] text-ink-muted font-bold">/wk</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-surface-secondary-dark/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs">
                {allAssigned ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    All {assignments.length} subjects ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    {missingCount} subject{missingCount > 1 ? 's' : ''} need a teacher
                  </span>
                )}
                <span className="text-[11px] text-ink-muted hidden sm:inline">• Clash prevention active</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-ink-sub hover:text-ink hover:bg-surface-secondary border border-line dark:border-line-dark transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !allAssigned}
                  className="px-4 py-1.5 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scheduling...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Auto-Generate
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClassTeacherMappingModal;
