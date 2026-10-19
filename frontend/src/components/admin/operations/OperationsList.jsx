import { useState } from 'react';
import { Search, Printer, Trash2, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS = {
  Open: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  In_Review: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  Resolved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Claimed: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
};

const OperationsList = ({ records = [], onStatusChange, onDelete, onPrint, loading }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = records.filter((r) => {
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchSearch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.details && r.details.toLowerCase().includes(search.toLowerCase())) ||
      (r.category && r.category.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  const getNextStatus = (cat) => (cat === 'Lost_Found' ? 'Claimed' : cat === 'Consent_Letter' ? 'Approved' : 'Resolved');

  return (
    <div className="p-5 rounded-2xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-semibold outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl border border-line bg-surface-secondary/40 font-bold outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In_Review">In Review</option>
          <option value="Resolved">Resolved</option>
          <option value="Approved">Approved</option>
          <option value="Claimed">Claimed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-line dark:border-line-dark">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-surface-secondary/60 text-ink-muted border-b border-line font-bold">
              <th className="py-2.5 px-3">Title / Subject</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3 text-center">Priority</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark font-medium">
            {loading ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">Loading records...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="py-8 text-center text-ink-muted">No records match the current filter.</td></tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-ink dark:text-ink-dark">{r.title}</div>
                    {r.student_id && <div className="text-[10px] text-ink-muted">Student: {r.student_id.name}</div>}
                    {r.item_location_or_fee && <div className="text-[10px] text-primary font-medium">{r.item_location_or_fee}</div>}
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted">{r.category?.replace('_', ' ')}</td>
                  <td className="py-2.5 px-3 text-ink-muted whitespace-nowrap">
                    {new Date(r.event_date || r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      r.priority === 'High' || r.priority === 'Urgent' ? 'text-rose-600 bg-rose-500/10' : r.priority === 'Low' ? 'text-ink-muted bg-surface-secondary' : 'text-amber-600 bg-amber-500/10'
                    }`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[r.status] || 'bg-surface-secondary'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                    {r.status === 'Open' && (
                      <button onClick={() => onStatusChange(r._id, getNextStatus(r.category))} title="Resolve / Complete" className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-500/10">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => onPrint(r)} title="Print Slip" className="p-1 rounded-lg text-ink-muted hover:text-primary hover:bg-primary/10">
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(r._id)} title="Delete" className="p-1 rounded-lg text-ink-muted hover:text-rose-600 hover:bg-rose-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationsList;
