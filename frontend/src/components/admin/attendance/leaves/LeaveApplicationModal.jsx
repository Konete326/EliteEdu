import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, X, Send, RotateCcw, ShieldCheck, Search, CheckCircle2, User, GraduationCap } from 'lucide-react';
import SearchableSelect from '../../../common/SearchableSelect';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Urgent Work', 'Family Event', 'Medical Leave', 'Official Duty', 'Other'];

const LeaveApplicationModal = ({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  onReset,
  isSubmitting,
  grades = [],
  students = [],
  teachers = [],
  isAdmin = true,
  isTeacher = false,
  currentUser = null
}) => {
  const [studentSearch, setStudentSearch] = useState('');

  useEffect(() => {
    if (isOpen && isTeacher && currentUser?.id) {
      if (form.applicant_type === 'Staff') {
        setForm((p) => ({ ...p, staff_id: currentUser.id }));
      } else if (form.applicant_type === 'Student' && !form.grade_id && grades.length > 0) {
        setForm((p) => ({ ...p, grade_id: grades[0]._id }));
      }
    }
  }, [isOpen, isTeacher, currentUser, form.applicant_type, grades, setForm]);

  const selectedGradeObj = useMemo(() => {
    return grades.find((g) => String(g._id) === String(form.grade_id));
  }, [grades, form.grade_id]);

  const availableSections = useMemo(() => {
    if (selectedGradeObj?.sections && Array.isArray(selectedGradeObj.sections) && selectedGradeObj.sections.length > 0) {
      return selectedGradeObj.sections;
    }
    return ['A', 'B', 'C', 'D'];
  }, [selectedGradeObj]);

  const classStudents = useMemo(() => {
    if (!form.grade_id) return students;
    return students.filter((s) => {
      const sGradeId = String(s.current_grade?._id || s.current_grade || '');
      const matchGrade = sGradeId === String(form.grade_id);
      if (!matchGrade) return false;
      if (!form.section || form.section === 'ALL') return true;
      const sSec = String(s.current_section || 'A').toUpperCase().trim();
      return sSec === String(form.section).toUpperCase().trim();
    });
  }, [students, form.grade_id, form.section]);

  const searchableStudents = useMemo(() => {
    if (!studentSearch.trim()) return classStudents;
    const q = studentSearch.toLowerCase().trim();
    return classStudents.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      String(s.gr_number || '').toLowerCase().includes(q) ||
      String(s.roll_number || '').toLowerCase().includes(q) ||
      s.father_name?.toLowerCase().includes(q)
    );
  }, [classStudents, studentSearch]);

  const selectedStudentObj = useMemo(() => {
    return students.find((s) => String(s._id) === String(form.student_id));
  }, [students, form.student_id]);

  const totalDays = useMemo(() => {
    if (!form.from_date || !form.to_date) return 1;
    const diff = Math.round((new Date(form.to_date) - new Date(form.from_date)) / 86400000) + 1;
    return isNaN(diff) || diff < 1 ? 1 : diff;
  }, [form.from_date, form.to_date]);

  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl shadow-2xl p-4 sm:p-6 my-auto max-h-[94vh] overflow-y-auto space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-ink dark:text-ink-dark">
                {isTeacher && form.applicant_type === 'Staff' ? 'Submit Faculty Leave' : 'Submit Leave Application'}
              </h2>
              <p className="text-[11px] sm:text-xs text-ink-muted dark:text-ink-muted-dark">
                {isTeacher && form.applicant_type === 'Student'
                  ? 'Record student leave with automated daily register synchronization'
                  : 'Submit official leave application with verified duration calculation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-3.5">
          <div className="flex rounded-2xl p-1 bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark gap-1">
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  applicant_type: 'Student',
                  staff_id: '',
                  grade_id: grades[0]?._id || ''
                }));
              }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                form.applicant_type === 'Student'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Student Leave
            </button>
            <button
              type="button"
              onClick={() => {
                setForm((p) => ({
                  ...p,
                  applicant_type: 'Staff',
                  student_id: '',
                  grade_id: '',
                  staff_id: isTeacher ? currentUser?.id : p.staff_id
                }));
              }}
              className={`flex-1 py-1.5 sm:py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                form.applicant_type === 'Staff'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {isTeacher ? 'My Own Leave' : 'Staff / Teacher Leave'}
            </button>
          </div>

          {form.applicant_type === 'Student' ? (
            <div className="space-y-2.5 sm:space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div>
                  <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">
                    Class / Grade *
                  </label>
                  <select
                    value={form.grade_id}
                    onChange={(e) => {
                      const nextGrade = e.target.value;
                      setForm((p) => ({ ...p, grade_id: nextGrade, student_id: '' }));
                    }}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer text-ink dark:text-ink-dark"
                    required
                  >
                    <option value="">Select Class ({grades.length})</option>
                    {grades.map((g) => (
                      <option key={g._id} value={g._id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">Section</label>
                  <select
                    value={form.section || 'A'}
                    onChange={(e) => setForm((p) => ({ ...p, section: e.target.value, student_id: '' }))}
                    className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer text-ink dark:text-ink-dark"
                  >
                    {availableSections.map((sec) => (
                      <option key={sec} value={sec}>Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold text-ink-muted block">
                    Select Student * ({searchableStudents.length})
                  </label>
                  {selectedStudentObj && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 truncate max-w-[180px] sm:max-w-xs">
                      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                      <span className="truncate">{selectedStudentObj.name}</span>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, roll no, or GR number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary text-ink dark:text-ink-dark placeholder:text-ink-muted"
                  />
                </div>

                <select
                  value={form.student_id}
                  onChange={(e) => setForm((p) => ({ ...p, student_id: e.target.value }))}
                  className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer text-ink dark:text-ink-dark truncate"
                  required
                >
                  <option value="">
                    {searchableStudents.length === 0
                      ? 'No students found in this section'
                      : `Choose Student (${searchableStudents.length} available)`}
                  </option>
                  {searchableStudents.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} {s.roll_number ? `(Roll #${s.roll_number})` : ''} — GR: {s.gr_number || '—'} {s.father_name ? `• S/O ${s.father_name}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedStudentObj && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                      {selectedStudentObj.name?.charAt(0) || 'S'}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-ink dark:text-ink-dark truncate">{selectedStudentObj.name}</h5>
                      <span className="text-[10px] text-ink-muted block truncate">
                        GR: {selectedStudentObj.gr_number || '—'} • Father: {selectedStudentObj.father_name || '—'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold shrink-0 ml-2">
                    Class {selectedGradeObj?.name || 'Class'} ({form.section || 'A'})
                  </span>
                </div>
              )}

              {isTeacher && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 sm:gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-[11px] sm:text-xs">Automated Attendance Synchronization</p>
                    <p className="text-[10px] sm:text-[11px] opacity-90 leading-tight">
                      Submitting will automatically mark student attendance as <strong>Leave (L)</strong> on the register for {totalDays} day(s).
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : isTeacher ? (
            <div className="space-y-2.5 sm:space-y-3">
              <div className="p-3 sm:p-4 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center justify-between">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {currentUser?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted block">
                      Applicant (Your Profile)
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark">
                      {currentUser?.name || 'Faculty Member'}
                    </h4>
                    <span className="text-[11px] sm:text-xs text-ink-muted">
                      {currentUser?.designation || 'Teacher'} • {currentUser?.employee_code || 'Staff'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                  Self Leave Request
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary dark:text-primary-hover text-xs flex items-start gap-2 sm:gap-2.5">
                <Calendar className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-[11px] sm:text-xs">Administration Approval Workflow</p>
                  <p className="text-[10px] sm:text-[11px] opacity-90 leading-tight">
                    Your leave application will be submitted directly to Principal / Management.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">Select Staff Member *</label>
              <SearchableSelect
                options={teachers.map((t) => ({
                  value: t._id,
                  label: t.name,
                  subtext: t.designation || 'Staff',
                  badge: t.employee_code || ''
                }))}
                value={form.staff_id}
                onChange={(val) => setForm((p) => ({ ...p, staff_id: val }))}
                placeholder={`Choose Faculty / Staff Member (${teachers.length} available)`}
                searchPlaceholder="Search staff by name or code..."
                size="sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">Leave Type *</label>
              <select
                value={form.leave_type}
                onChange={(e) => setForm((p) => ({ ...p, leave_type: e.target.value }))}
                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary cursor-pointer text-ink dark:text-ink-dark"
              >
                {LEAVE_TYPES.map((lt) => (
                  <option key={lt} value={lt}>{lt}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1">
              <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">From Date *</label>
              <input
                type="date"
                value={form.from_date}
                onChange={(e) => setForm((p) => ({ ...p, from_date: e.target.value }))}
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary text-ink dark:text-ink-dark"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="text-[11px] sm:text-xs font-bold text-ink-muted block mb-1">To Date *</label>
              <input
                type="date"
                value={form.to_date}
                min={form.from_date}
                onChange={(e) => setForm((p) => ({ ...p, to_date: e.target.value }))}
                className="w-full px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary text-ink dark:text-ink-dark"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] sm:text-xs font-bold text-ink-muted">Reason / Application Details *</label>
              <span className="text-[10px] sm:text-[11px] font-bold text-primary">Duration: {totalDays} Day(s)</span>
            </div>
            <textarea
              rows={2}
              value={form.reason}
              onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
              placeholder="State the reason for leave in clear detail..."
              className="w-full px-3 py-1.5 sm:py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs outline-none focus:border-primary resize-none text-ink dark:text-ink-dark"
              required
            />
          </div>

          {isAdmin && (
            <label className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-surface-secondary/40 border border-line dark:border-line-dark cursor-pointer">
              <input
                type="checkbox"
                checked={form.auto_approve ?? true}
                onChange={(e) => setForm((p) => ({ ...p, auto_approve: e.target.checked }))}
                className="rounded accent-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary shrink-0" /> Auto-approve and sync to register immediately
              </span>
            </label>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={() => {
                onReset();
                setStudentSearch('');
              }}
              className="flex items-center gap-1 text-[11px] sm:text-xs text-ink-muted hover:text-ink cursor-pointer"
            >
              <RotateCcw size={12} /> Reset Form
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-line dark:border-line-dark text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send size={12} /> {isSubmitting ? 'Submitting...' : 'Submit Leave'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
};

export default LeaveApplicationModal;
