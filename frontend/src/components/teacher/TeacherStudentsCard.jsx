import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ArrowUpRight, Pencil } from 'lucide-react';

const TeacherStudentsCard = ({ students = [], loading = false }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.gr_number?.toLowerCase().includes(q) ||
        s.father_name?.toLowerCase().includes(q) ||
        s.current_grade?.name?.toLowerCase().includes(q)
    );
  }, [students, search]);

  return (
    <div className="rounded-3xl bg-surface dark:bg-[#0c0c0f] border border-line dark:border-line-dark p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm text-ink dark:text-ink-dark">My Students Directory</h3>
            <p className="text-[11px] text-ink-muted">Enrolled in your assigned classes & sections</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or GR..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-surface-secondary/50 dark:bg-[#16161d] border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => navigate('/teacher/students')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors cursor-pointer shrink-0"
          >
            <span>Manage All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-ink-muted animate-pulse">
          Loading assigned student records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-xs text-ink-muted border border-dashed border-line dark:border-line-dark rounded-2xl">
          {search ? 'No student matches your query.' : 'No students enrolled in your assigned classes yet.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line dark:border-line-dark">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 dark:bg-[#141417] text-ink-muted border-b border-line dark:border-line-dark">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Father Name</th>
                <th className="py-2.5 px-3 font-semibold">Class & Sec</th>
                <th className="py-2.5 px-3 font-semibold">GR No</th>
                <th className="py-2.5 px-3 font-semibold">Contact</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark">
              {filtered.map((s) => (
                <tr key={s._id} className="hover:bg-surface-secondary/30 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                        {s.name ? s.name[0] : 'S'}
                      </div>
                      <span className="font-bold text-ink dark:text-ink-dark">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted">{s.father_name || '—'}</td>
                  <td className="py-2.5 px-3 font-semibold text-primary dark:text-primary-dark">
                    {s.current_grade?.name || 'Class'} {s.current_section ? `(${s.current_section})` : ''}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-ink dark:text-ink-dark">
                    {s.gr_number}
                  </td>
                  <td className="py-2.5 px-3 text-ink-muted">
                    {s.emergency_contact_no || s.contact_number || '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('/teacher/students')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-2.5 h-2.5" />
                      <span>Edit Full Profile</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsCard;
