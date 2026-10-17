import React, { useMemo } from 'react';
import { Send, RotateCcw, Calendar, UserCheck, ShieldCheck } from 'lucide-react';

const LEAVE_TYPES = ['Sick Leave', 'Casual Leave', 'Urgent Work', 'Family Event', 'Medical Leave', 'Official Duty', 'Other'];

const LeaveRequestFormCard = ({
  form, setForm, onSubmit, onReset, isSubmitting, grades = [], students = [], teachers = [], isAdmin = true
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

  return (
    <form onSubmit={onSubmit} className="p-4 sm:p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
        <h2 className="text-sm font-bold text-ink dark:text-white flex items-center gap-2">
          <Calendar size={16} className="text-primary" /> New Leave Application
        </h2>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {totalDays} Day{totalDays > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex rounded-xl p-1 bg-surface-secondary/70 dark:bg-white/[0.04] border border-line dark:border-line-dark gap-1">
        <button type="button" onClick={() => setForm((p) => ({ ...p, applicant_type: 'Student', staff_id: '' }))} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${form.applicant_type === 'Student' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted'}`}>Student Leave</button>
        <button type="button" onClick={() => setForm((p) => ({ ...p, applicant_type: 'Staff', student_id: '', grade_id: '' }))} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${form.applicant_type === 'Staff' ? 'bg-primary text-white shadow-xs' : 'text-ink-muted'}`}>Staff / Teacher</button>
      </div>

      {form.applicant_type === 'Student' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-ink-muted block mb-1">Class *</label>
              <select value={form.grade_id} onChange={(e) => setForm((p) => ({ ...p, grade_id: e.target.value, student_id: '' }))} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold" required>
                <option value="">Select Class</option>
                {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-ink-muted block mb-1">Section</label>
              <input type="text" value={form.section || 'A'} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-ink-muted block mb-1">Select Student *</label>
            <select value={form.student_id} onChange={(e) => setForm((p) => ({ ...p, student_id: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold" required>
              <option value="">Choose Student ({filteredStudents.length} available)</option>
              {filteredStudents.map((s) => <option key={s._id} value={s._id}>{s.name} (GR: {s.gr_number || '—'})</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <label className="text-[11px] font-bold text-ink-muted block mb-1">Staff Member *</label>
          <select value={form.staff_id} onChange={(e) => setForm((p) => ({ ...p, staff_id: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold" required>
            <option value="">Choose Faculty / Staff Member</option>
            {teachers.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.designation || 'Staff'} • {t.employee_code || '—'})</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="text-[11px] font-bold text-ink-muted block mb-1">Leave Category *</label>
        <select value={form.leave_type} onChange={(e) => setForm((p) => ({ ...p, leave_type: e.target.value }))} className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-transparent text-xs font-semibold">
          {LEAVE_TYPES.map((lt) => <option key={lt} value={lt}>{lt}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-bold text-ink-muted block mb-1">From Date *</label>
          <input type="date" value={form.from_date} onChange={(e) => setForm((p) => ({ ...p, from_date: e.target.value }))} className="w-full px-2 py-1.5 rounded-xl border border-line bg-transparent text-xs font-mono" required />
        </div>
        <div>
          <label className="text-[11px] font-bold text-ink-muted block mb-1">To Date *</label>
          <input type="date" value={form.to_date} onChange={(e) => setForm((p) => ({ ...p, to_date: e.target.value }))} className="w-full px-2 py-1.5 rounded-xl border border-line bg-transparent text-xs font-mono" required />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-ink-muted block mb-1">Reason / Details *</label>
        <textarea rows={3} value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Explain reason for leave..." className="w-full p-2.5 rounded-xl border border-line bg-transparent text-xs outline-none focus:border-primary resize-none" required />
      </div>

      {isAdmin && (
        <label className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs font-semibold cursor-pointer">
          <input type="checkbox" checked={form.auto_approve ?? true} onChange={(e) => setForm((p) => ({ ...p, auto_approve: e.target.checked }))} className="rounded text-primary focus:ring-0" />
          <span className="flex items-center gap-1.5 text-primary"><ShieldCheck size={14} /> Auto-Approve & Sync to Attendance</span>
        </label>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white shadow-xs cursor-pointer">
          <Send size={13} /> {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
        <button type="button" onClick={onReset} className="p-2 rounded-xl border border-line hover:bg-surface-secondary text-ink-muted cursor-pointer" title="Reset form">
          <RotateCcw size={14} />
        </button>
      </div>
    </form>
  );
};

export default LeaveRequestFormCard;
