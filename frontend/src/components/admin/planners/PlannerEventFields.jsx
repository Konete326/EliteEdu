const PlannerEventFields = ({ form, onChange, grades = [] }) => (
  <>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Event Type</label>
        <select value={form.record_type} onChange={(e) => onChange('record_type', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
          <option value="School_Event">School Event</option>
          <option value="Holiday">Official Holiday</option>
          <option value="PTM">PTM (Parent Meeting)</option>
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Audience</label>
        <select value={form.target_audience} onChange={(e) => onChange('target_audience', e.target.value)} className="w-full px-2 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
          <option value="All">All School</option>
          <option value="Teachers">Teachers Only</option>
          <option value="Students">Students Only</option>
          <option value="Specific_Class">Specific Class</option>
        </select>
      </div>
    </div>
    {form.target_audience === 'Specific_Class' && (
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
    )}
    <div>
      <label className="block text-[10px] font-bold text-ink-muted mb-0.5">Event Details / Circular Notice</label>
      <textarea rows={3} value={form.description} onChange={(e) => onChange('description', e.target.value)} placeholder="Notice text, venue, schedule, or instructions..." className="w-full px-2.5 py-1.5 rounded-xl border border-line bg-surface-secondary/40 font-medium outline-none resize-none" />
    </div>
  </>
);

export default PlannerEventFields;
