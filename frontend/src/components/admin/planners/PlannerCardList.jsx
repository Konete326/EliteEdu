import { useState } from 'react';
import { Search, Calendar, BookOpen, Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react';

const STATUS_NEXT = { Planned: 'In_Progress', In_Progress: 'Completed', Completed: 'Planned', Cancelled: 'Planned' };
const STATUS_STYLES = {
  Planned: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  In_Progress: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  Completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

const PlannerCardList = ({ records = [], onStatusChange, onEdit, onDelete, loading, activeTab, grades = [] }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');

  const filtered = records.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchGrade = gradeFilter === 'All' || String(r.grade_id?._id || r.grade_id) === String(gradeFilter);
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase())) ||
      (r.learning_objectives && r.learning_objectives.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchGrade && matchSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topic or keywords..." className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {grades.length > 0 && (
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
              <option value="All">All Grades</option>
              {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
            </select>
          )}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-2.5 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none">
            <option value="All">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="In_Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-ink-muted">Loading schedule timeline...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-xs text-ink-muted space-y-1">
          <BookOpen className="w-8 h-8 mx-auto text-ink-muted/40" />
          <p className="font-bold text-ink">No entries match your search criteria</p>
          <p className="text-[11px]">Create a new lesson plan or schedule an event from the form on the left.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div key={item._id} className="p-3.5 rounded-xl border border-line bg-surface hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {item.record_type.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-ink-muted font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.start_date).toLocaleDateString()}
                    {item.end_date && item.end_date !== item.start_date && ` - ${new Date(item.end_date).toLocaleDateString()}`}
                  </span>
                  {item.grade_id && (
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-surface-secondary border border-line text-ink">
                      {item.grade_id.name} ({item.section}) {item.subject_id && `• ${item.subject_id.name}`}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-ink dark:text-ink-dark pt-0.5">{item.title}</h4>
                {item.learning_objectives && <p className="text-[11px] text-ink-muted line-clamp-2"><strong>Objectives:</strong> {item.learning_objectives}</p>}
                {item.teaching_aids && <p className="text-[10px] text-ink-muted font-mono"><strong>Aids:</strong> {item.teaching_aids}</p>}
                {item.description && <p className="text-[11px] text-ink-muted line-clamp-2">{item.description}</p>}
                {item.teacher_id && <div className="text-[10px] text-primary font-semibold pt-0.5">Faculty: {item.teacher_id.name}</div>}
              </div>

              <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onStatusChange(item._id, STATUS_NEXT[item.status] || 'Completed')}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${STATUS_STYLES[item.status] || 'bg-surface-secondary'}`}
                  title="Click to advance status"
                >
                  {item.status === 'Completed' ? '✓ Completed' : item.status.replace('_', ' ')}
                </button>
                <div className="flex items-center gap-1 pt-1">
                  <button onClick={() => onEdit(item)} className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => onDelete(item._id)} className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlannerCardList;
