import { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import ConcessionAssignModal from '../../../components/admin/fees/ConcessionAssignModal';
import FeeConcessionsHeader from '../../../components/admin/fees/FeeConcessionsHeader';

const FeeConcessionsPage = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total_scholarship_monthly: 0, discounted_students_count: 0 });
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ search });
      if (gradeFilter) params.append('grade_id', gradeFilter);
      if (onlyDiscounted) params.append('only_discounted', 'true');

      const [conRes, grdRes] = await Promise.all([
        api.get(`/fees/concessions?${params.toString()}`).catch(() => ({ data: { students: [], stats: {} } })),
        api.get('/grades').catch(() => ({ data: { data: [] } }))
      ]);

      if (conRes.data?.students) setStudents(conRes.data.students);
      if (conRes.data?.stats) setStats(conRes.data.stats);
      if (grdRes.data?.data) setGrades(grdRes.data.data);
    } catch {
      showToast('Error loading concessions', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, onlyDiscounted, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleRemoveConcession = async (st) => {
    try {
      await api.patch(`/fees/concessions/${st._id}`, { discount: 0, discount_reference: '' });
      showToast(`Concession removed for ${st.name}`, 'success');
      loadData();
    } catch {
      showToast('Failed to remove concession', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <FeeConcessionsHeader
        stats={stats} search={search} onSearchChange={setSearch}
        gradeFilter={gradeFilter} onGradeChange={setGradeFilter}
        grades={grades} onlyDiscounted={onlyDiscounted}
        onToggleOnlyDiscounted={setOnlyDiscounted}
      />

      <div className="overflow-x-auto rounded-2xl border border-line bg-surface dark:bg-surface-dark">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/60 text-ink-muted text-[10px] uppercase font-bold border-b border-line">
            <tr>
              <th className="py-2.5 px-3">Student & GR #</th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3 text-right">Base Fee</th>
              <th className="py-2.5 px-3 text-right">Concession</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Net Monthly</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {students.length === 0 ? (
              <tr><td colSpan="7" className="py-8 text-center text-ink-muted">{loading ? 'Loading...' : 'No student records found.'}</td></tr>
            ) : (
              students.map((st) => {
                const base = Number(st.monthly_fee || 0);
                const disc = Number(st.discount || 0);
                const net = Math.max(0, base - disc);
                return (
                  <tr key={st._id} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-bold text-ink dark:text-ink-dark">{st.name}</div>
                      <div className="text-[10px] text-ink-muted font-mono">GR: {st.gr_number}</div>
                    </td>
                    <td className="py-2 px-3">{st.current_grade?.name || '—'} ({st.current_section || 'A'})</td>
                    <td className="py-2 px-3 text-right font-mono">Rs. {base.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">{disc > 0 ? `Rs. ${disc.toLocaleString()}` : '—'}</td>
                    <td className="py-2 px-3">
                      {st.discount_reference ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {st.discount_reference}
                        </span>
                      ) : <span className="text-ink-muted text-[11px]">Standard</span>}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-black text-ink">Rs. {net.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setSelectedStudent(st)} className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-[11px]">
                          Assign / Edit
                        </button>
                        {disc > 0 && (
                          <button type="button" onClick={() => handleRemoveConcession(st)} className="p-1 rounded-lg text-ink-muted hover:text-bad" title="Remove Concession">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConcessionAssignModal isOpen={Boolean(selectedStudent)} onClose={() => setSelectedStudent(null)} student={selectedStudent} onSuccess={() => { showToast('Concession saved', 'success'); loadData(); }} />
    </div>
  );
};

export default FeeConcessionsPage;
