const PlannerLessonFields = ({ form, onChange, grades = [], subjects = [], teachers = [] }) => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Class / Grade</label>
        <select value={form.grade_id} onChange={(e) => onChange('grade_id', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
          <option value="">Select Class...</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Section</label>
        <input type="text" value={form.section} onChange={(e) => onChange('section', e.target.value)} placeholder="A" className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Subject</label>
        <select value={form.subject_id} onChange={(e) => onChange('subject_id', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
          <option value="">Select Subject...</option>
          {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Teacher</label>
        <select value={form.teacher_id} onChange={(e) => onChange('teacher_id', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
          <option value="">Assign Teacher...</option>
          {teachers.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
      </div>
    </div>
    <div>
      <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Learning Objectives</label>
      <textarea rows={2} value={form.learning_objectives} onChange={(e) => onChange('learning_objectives', e.target.value)} placeholder="Students will understand..." className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-medium outline-none resize-none" />
    </div>
    <div>
      <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Teaching Aids / Material</label>
      <input type="text" value={form.teaching_aids} onChange={(e) => onChange('teaching_aids', e.target.value)} placeholder="Whiteboard, Multimedia, Lab Kit" className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none" />
    </div>
  </>
);

export default PlannerLessonFields;
