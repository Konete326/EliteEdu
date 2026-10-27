import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { X, Shuffle, PlusCircle, Clock, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';

const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const TeacherPeriodAdjustmentModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialSlot = null,
  grades = [],
  subjects = []
}) => {
  const { showToast } = useToast();
  const todayStr = new Date().toISOString().slice(0, 10);

  const [adjustmentType, setAdjustmentType] = useState('Extra_Class');
  const [date, setDate] = useState(todayStr);
  const [periodNo, setPeriodNo] = useState(1);
  const [gradeId, setGradeId] = useState('');
  const [section, setSection] = useState('A');
  const [subjectId, setSubjectId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialSlot) {
      if (initialSlot.period_no) setPeriodNo(Number(initialSlot.period_no));
      if (initialSlot.slot_data?.grade_id?._id) setGradeId(initialSlot.slot_data.grade_id._id);
      if (initialSlot.slot_data?.section) setSection(initialSlot.slot_data.section);
      if (initialSlot.slot_data?.subject_id?._id) setSubjectId(initialSlot.slot_data.subject_id._id);
      if (initialSlot.is_free) {
        setAdjustmentType('Extra_Class');
      }
    } else {
      if (grades.length > 0 && !gradeId) setGradeId(grades[0]._id);
      if (subjects.length > 0 && !subjectId) setSubjectId(subjects[0]._id);
    }
  }, [initialSlot, grades, subjects]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        adjustment_type: adjustmentType,
        date,
        period_no: Number(periodNo),
        grade_id: gradeId,
        section,
        subject_id: subjectId,
        remarks: remarks.trim(),
        slot_id: initialSlot?.slot_data?._id || null
      };

      const res = await api.post('/timetable/quick-adjustment', payload);
      if (res.data?.success) {
        showToast(res.data.message || 'Period adjustment saved successfully', 'success');
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save period adjustment', 'error');
    } finally {
      setSaving(false);
    }
  };

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">
                Quick Daily Period Adjustment
              </h3>
              <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
                Take proxy, double period or mark relief without altering master timetable
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('Extra_Class')}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  adjustmentType === 'Extra_Class'
                    ? 'border-primary bg-primary/10 text-primary shadow-xs'
                    : 'border-line dark:border-line-dark text-ink-muted hover:text-ink'
                }`}
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>Extra / Proxy Class</div>
                  <div className="text-[9px] font-normal text-ink-muted">Take another period</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('Double_Period')}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  adjustmentType === 'Double_Period'
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'border-line dark:border-line-dark text-ink-muted hover:text-ink'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>Double Period</div>
                  <div className="text-[9px] font-normal text-ink-muted">Extend current class</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('Substitution')}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  adjustmentType === 'Substitution'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'border-line dark:border-line-dark text-ink-muted hover:text-ink'
                }`}
              >
                <Shuffle className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>Cover Absent Staff</div>
                  <div className="text-[9px] font-normal text-ink-muted">Relief proxy duty</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('Relieved_Busy')}
                className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  adjustmentType === 'Relieved_Busy'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 shadow-xs'
                    : 'border-line dark:border-line-dark text-ink-muted hover:text-ink'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>Mark Relieved / Busy</div>
                  <div className="text-[9px] font-normal text-ink-muted">On other duty / meeting</div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink dark:text-ink-dark">
                Period Number
              </label>
              <select
                value={periodNo}
                onChange={(e) => setPeriodNo(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {PERIODS.map((p) => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>
          </div>

          {adjustmentType !== 'Relieved_Busy' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink dark:text-ink-dark">
                    Class / Grade *
                  </label>
                  <select
                    value={gradeId}
                    onChange={(e) => setGradeId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select Grade</option>
                    {grades.map((g) => (
                      <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-ink dark:text-ink-dark">
                    Section *
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {SECTIONS.map((sec) => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ink dark:text-ink-dark">
                  Teaching Subject *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name} ({sub.code || 'Sub'})</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink dark:text-ink-dark">
              Reason / Remarks (Optional)
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder={
                adjustmentType === 'Relieved_Busy'
                  ? 'e.g. Science Lab preparation / Principal briefing'
                  : adjustmentType === 'Double_Period'
                  ? 'e.g. Completing Chapter 4 revision'
                  : 'e.g. Covering for Sir Tariq on leave'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-medium text-ink dark:text-ink-dark focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-white/5 border border-line/60 dark:border-line-dark/60 text-xs text-ink-muted flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              This adjustment applies only to the selected date. The master timetable schedule will not be changed or overwritten.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:text-ink transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Apply Period Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default TeacherPeriodAdjustmentModal;
