import { useState } from 'react';
import { Search, Printer, Star, Trash2 } from 'lucide-react';

const BADGE_STYLES = {
  Merit_Star: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  Good_Conduct: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  Needs_Counseling: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
  Disciplinary_Warning: 'bg-rose-500/15 text-rose-600 border-rose-500/30'
};

const BehaviorLeaderboard = ({ records = [], onPrint, onDelete, loading }) => {
  const [search, setSearch] = useState('');
  const [badgeFilter, setBadgeFilter] = useState('All');

  const filtered = records.filter((r) => {
    const student = r.student_id || {};
    const matchBadge = badgeFilter === 'All' || r.badge_type === badgeFilter;
    const matchSearch = !search ||
      (student.name && student.name.toLowerCase().includes(search.toLowerCase())) ||
      (r.teacher_observation && r.teacher_observation.toLowerCase().includes(search.toLowerCase()));
    return matchBadge && matchSearch;
  });

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student or remarks..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <select
          value={badgeFilter}
          onChange={(e) => setBadgeFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none"
        >
          <option value="All">All Badges</option>
          <option value="Merit_Star">Merit Star</option>
          <option value="Good_Conduct">Good Conduct</option>
          <option value="Needs_Counseling">Needs Guidance</option>
          <option value="Disciplinary_Warning">Disciplinary Warning</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Student</th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3 text-center">Affective</th>
              <th className="py-2.5 px-3 text-center">Psychomotor</th>
              <th className="py-2.5 px-3 text-center">Awarded Badge</th>
              <th className="py-2.5 px-3">Observation</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">Loading evaluations...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">No student evaluations found for this term.</td></tr>
            ) : (
              filtered.map((r) => {
                const s = r.student_id || {};
                const g = r.grade_id || {};
                const affAvg = (Object.values(r.affective_ratings || {}).reduce((a, b) => a + b, 0) / 5).toFixed(1);
                const psyAvg = (Object.values(r.psychomotor_ratings || {}).reduce((a, b) => a + b, 0) / 5).toFixed(1);
                return (
                  <tr key={r._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-ink dark:text-ink-dark">{s.name || 'Student'}</div>
                      <div className="text-[10px] text-ink-muted font-mono">{s.roll_number ? `Roll: ${s.roll_number}` : ''}</div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-ink-muted whitespace-nowrap">{g.name || 'Grade'}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-600">{affAvg} / 5</td>
                    <td className="py-2.5 px-3 text-center font-bold text-primary">{psyAvg} / 5</td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${BADGE_STYLES[r.badge_type] || 'bg-surface-secondary'}`}>
                        {r.badge_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-[180px] truncate text-ink-muted">{r.teacher_observation || '—'}</td>
                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                      <button onClick={() => onPrint(r)} title="Print Certificate" className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10">
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(r._id)} title="Delete" className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BehaviorLeaderboard;
