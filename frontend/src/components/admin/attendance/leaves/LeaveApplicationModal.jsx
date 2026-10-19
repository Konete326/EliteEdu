import React, { useMemo } from 'react';
import { Calendar, X, Send, RotateCcw, ShieldCheck } from 'lucide-react';

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
  isAdmin = true
}) => {
  const filteredStudents = useMemo(() => {
    if (!form.grade_id || form.grade_id === 'all') return students;
    return students.filter((s) => String(s.current_grade?._id || s.current_grade) === String(form.grade_id));
  }, [students, form.grade_id]);

  const totalDays = useMemo(() => {
    if (!form.from_date || !form.to_date) return 1;
    const diff = Math.round((new Date(form.to_date) - new Date(form.from_date)) / 86400000) + 1;
    return isNaN(diff) || diff < 1 ? 1 : diff;
  }, [form.from_date, form.to_date]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl shadow-2xl p-6 my-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-ink dark:text-ink-dark">
                Submit Leave Application
              </h2>
              <p className="text-xs text-ink-muted">
                Record official leave request with automated attendance register synchronization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex rounded-xl p-1 bg-surface-secondary/70 dark:bg-white/[0.04] border border-line dark:border-line-dark gap-1">
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, applicant_type: 'Student', staff_id: '' }))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                form.applicant_type === 'Student' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted'
              }`}
            >
              Student Leave
            </button>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, applicant_type: 'Staff', student_id: '', grade_id: '' }))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                form.applicant_type === 'Staff' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted'
              }`}
            >
              Staff / Teacher Leave
            </button>
          </div>

          {form.applicant_type === 'Student' ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Class / Grade *</label>
                  <select
                    value={form.grade_id}
                    onChange={(e) => setForm((p) => ({ ...p, grade_id: e.target.value, student_id: '' }))}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select Class</option>
                    {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-ink-muted block mb-1">Section</label>
                  <input
                    type="text"
                    value={form.section || 'A'}
                    onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-ink-muted block mb-1">Select Student *</label>
                <select
                  value={form.student_id}
                  onChange={(e) => setForm((p) => ({ ...p, student_id: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                  required
                >
                  <option value="">Choose Student ({filteredStudents.length} available)</option>
                  {filteredStudents.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} (GR: {s.gr_number || '—'})</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-ink-muted block mb-1">Select Staff Member *</label>
              <select
                value={form.staff_id}
                onChange={(e) => setForm((p) => ({ ...p, staff_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                required
              >
                <option value="">Choose Faculty / Staff Member ({teachers.length} available)</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — {t.designation || 'Staff'} ({t.employee_code || 'EMP'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-ink-muted block mb-1">Leave Type *</label>
              <select
                value={form.leave_type}
                onChange={(e) => setForm((p) => ({ ...p, leave_type: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
              >
                {LEAVE_TYPES.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-ink-muted block mb-1">From Date *</label>
              <input
                type="date"
                value={form.from_date}
                onChange={(e) => setForm((p) => ({ ...p, from_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-ink-muted block mb-1">To Date *</label>
              <input
                type="date"
                value={form.to_date}
                min={form.from_date}
                onChange={(e) => setForm((p) => ({ ...p, to_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs font-semibold outline-none focus:border-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-ink-muted block mb-1">
              Reason / Application Details *
            </label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
              placeholder="State the reason for leave in detail..."
              className="w-full px-3 py-2 rounded-xl border border-line bg-surface-secondary/40 text-xs outline-none focus:border-primary resize-none"
              required
            />
          </div>

          {isAdmin && (
            <label className="flex items-center gap-2 p-3 rounded-xl bg-surface-secondary/40 border border-line cursor-pointer">
              <input
                type="checkbox"
                checked={form.auto_approve ?? true}
                onChange={(e) => setForm((p) => ({ ...p, auto_approve: e.target.checked }))}
                className="rounded accent-primary w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-semibold text-ink dark:text-ink-dark flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-primary" /> Auto-approve and sync to register immediately
              </span>
            </label>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-line dark:border-line-dark">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Form
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-line text-xs font-bold text-ink-muted hover:text-ink cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Send size={13} /> {isSubmitting ? 'Submitting...' : 'Submit Leave'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationModal;
