import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, CalendarCheck, Award, ArrowUpRight } from 'lucide-react';
import api from '../../services/api';

const TeacherStudentsRosterPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api.get('/teacher-portal/my-students')
      .then((res) => {
        if (!mounted) return;
        setStudents(res.data?.students || []);
      })
      .catch(() => setStudents([]))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const sections = ['All', ...new Set(students.map((s) => s.current_section).filter(Boolean))];

  const filtered = students.filter((s) => {
    const q = search.toLowerCase().trim();
    const matchQ = !q || s.name?.toLowerCase().includes(q) || s.father_name?.toLowerCase().includes(q) || s.gr_number?.toLowerCase().includes(q);
    const matchSec = selectedSection === 'All' || s.current_section === selectedSection;
    return matchQ && matchSec;
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark tracking-tight">My Students Roster</h1>
          <p className="text-xs text-ink-muted">Students actively enrolled in your assigned classes and subjects.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/teacher/attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-hover transition-colors"
          >
            <CalendarCheck size={14} /> Mark Attendance
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher/class-tests')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-xs font-bold text-ink dark:text-ink-dark hover:border-primary transition-colors"
          >
            <Award size={14} /> Class Tests
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search student by name, father name or GR number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          aria-label="Filter by Section"
          className="px-3 py-2 text-xs rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-ink dark:text-ink-dark font-medium outline-none"
        >
          {sections.map((sec) => (
            <option key={sec} value={sec}>Section: {sec}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-line dark:border-line-dark bg-surface-secondary/50 text-ink-muted font-bold text-[11px] uppercase tracking-wider">
                <th className="p-3">Student</th>
                <th className="p-3">GR #</th>
                <th className="p-3">Grade / Class</th>
                <th className="p-3">Section</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line dark:divide-line-dark text-ink dark:text-ink-dark">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-ink-muted font-medium">Loading assigned roster...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-ink-muted font-medium">No students found matching your criteria.</td></tr>
              ) : (
                filtered.map((st) => (
                  <tr key={st._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs overflow-hidden shrink-0">
                          {st.photo_url ? <img src={st.photo_url} alt="" className="w-full h-full object-cover" /> : st.name?.[0] || 'S'}
                        </div>
                        <div>
                          <p className="font-bold line-clamp-1">{st.name}</p>
                          <p className="text-[10px] text-ink-muted line-clamp-1">S/O {st.father_name || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold">{st.gr_number || '—'}</td>
                    <td className="p-3 font-bold text-primary">{st.current_grade?.name || 'Class'}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-md font-bold bg-surface-secondary text-[10px]">{st.current_section || 'A'}</span></td>
                    <td className="p-3 font-mono text-ink-muted">{st.contact_number || st.emergency_contact_no || '—'}</td>
                    <td className="p-3 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 dark:text-green-400">Active</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherStudentsRosterPage;
