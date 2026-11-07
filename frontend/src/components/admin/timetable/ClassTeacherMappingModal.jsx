import { useState, useEffect } from 'react';
import { X, Zap, Loader2, Sparkles, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';
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

  const allAssigned = assignments.length > 0 && assignments.every((a) => a.teacher_id);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 space-y-5 my-8">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" /> 1-Click Clash-Free Scheduler
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-gray-100">
              Auto-Generate Routine: {displayClassName} (Section {selectedSection})
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Har subject ke aagay Teacher select karein. System Friday short day aur zero teacher clashes ke sath poora hafta auto-fill kar dega.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-bold">Loading curriculum subjects &amp; teachers...</span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="py-10 text-center space-y-2">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No active subjects found for this class.</p>
            <p className="text-xs text-gray-500">Please make sure subjects are created and linked with {displayClassName}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {assignments.map((item) => (
                <div
                  key={item.subject_id}
                  className="p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/60 dark:bg-gray-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-[180px]">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900 dark:text-gray-100">{item.subject_name}</div>
                      <div className="text-[11px] text-gray-400">{item.subject_code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-1 min-w-[200px]">
                      <SearchableSelect
                        options={teacherOptions}
                        value={item.teacher_id}
                        onChange={(val) => handleTeacherChange(item.subject_id, val)}
                        placeholder="Select Teacher..."
                        searchPlaceholder="Search teacher name..."
                        size="sm"
                      />
                    </div>
                    <div className="w-24 shrink-0 flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={item.periods_per_week}
                        onChange={(e) => handlePeriodsChange(item.subject_id, e.target.value)}
                        className="w-full px-2 py-1.5 text-center text-xs font-bold border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600"
                        title="Periods per week"
                      />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">/Wk</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                {allAssigned ? 'All teachers assigned' : 'Select teacher for each subject'}
              </span>
              <span className="text-[11px] text-blue-600/80 font-semibold">
                Automatic multi-class clash solver active
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !allAssigned}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Scheduling Week...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Auto-Generate Timetable
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClassTeacherMappingModal;
