import { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { useToast } from '../../../context/ToastContext';
import ReportExportToolbar from '../../../components/admin/reports/ReportExportToolbar';
import DefaulterNoticeModal from '../../../components/admin/fees/DefaulterNoticeModal';
import FeeDefaultersListTable from '../../../components/admin/fees/FeeDefaultersListTable';

const FeeDefaultersPage = () => {
  const { showToast } = useToast();
  const [defaulters, setDefaulters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeFilter, setGradeFilter] = useState('');
  const [minArrears, setMinArrears] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNotice, setActiveNotice] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', '50');
      if (gradeFilter) params.append('grade_id', gradeFilter);
      if (minArrears) params.append('min_arrears', minArrears);

      const [defRes, grdRes] = await Promise.all([
        api.get(`/fees/defaulters?${params.toString()}`).catch(() => ({ data: { defaulters: [], total: 0, totalPages: 1 } })),
        api.get('/grades').catch(() => ({ data: { data: [] } }))
      ]);
      if (defRes.data?.defaulters) {
        setDefaulters(defRes.data.defaulters);
        setTotalPages(defRes.data.totalPages || 1);
        setTotalCount(defRes.data.total || 0);
      }
      if (grdRes.data?.data) setGrades(grdRes.data.data);
    } catch {
      showToast('Error loading fee defaulters', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, gradeFilter, minArrears, showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleGradeChange = (val) => {
    setGradeFilter(val);
    setPage(1);
  };

  const handleMinArrearsChange = (val) => {
    setMinArrears(val);
    setPage(1);
  };

  const handleSendAlert = async (d) => {
    try {
      await api.post('/fees/defaulters/alert', { student_id: d.student?._id, total_balance: d.total_balance });
      showToast(`Reminder alert sent to ${d.student?.name}`, 'success');
    } catch {
      showToast('Failed to dispatch alert', 'error');
    }
  };

  const filtered = defaulters.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return d.student?.name?.toLowerCase().includes(q) || d.student?.gr_number?.toLowerCase().includes(q) || d.student?.father_name?.toLowerCase().includes(q);
  });

  const exportCols = [
    { key: 'gr_number', label: 'GR #' }, { key: 'name', label: 'Student Name' },
    { key: 'father_name', label: 'Father Name' }, { key: 'class', label: 'Class' },
    { key: 'phone', label: 'Contact' }, { key: 'total_balance', label: 'Arrears (PKR)' }
  ];
  const exportRows = filtered.map((d) => ({
    gr_number: d.student?.gr_number, name: d.student?.name, father_name: d.student?.father_name,
    class: d.grade?.name, phone: d.student?.contact_number, total_balance: d.total_balance
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-ink dark:text-ink-dark uppercase tracking-tight">Fee Defaulters & Recovery Hub</h1>
        <p className="text-xs text-ink-muted">Identify students with overdue fees, send WhatsApp reminders, and issue formal recovery notices.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-surface border border-line text-xs">
        <select value={gradeFilter} onChange={(e) => handleGradeChange(e.target.value)} className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none">
          <option value="">All Classes</option>
          {grades.map((g) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        <input
          type="number"
          placeholder="Min Arrears (PKR)..."
          value={minArrears}
          onChange={(e) => handleMinArrearsChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-line bg-surface text-ink outline-none w-36 font-mono"
        />
      </div>

      <ReportExportToolbar columns={exportCols} rows={exportRows} filename="fee-defaulters-list" searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <FeeDefaultersListTable
        defaulters={filtered}
        loading={loading}
        onSendAlert={handleSendAlert}
        onOpenNotice={(d) => setActiveNotice(d)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 text-xs border border-line rounded-xl bg-surface">
          <span className="text-ink-muted">
            Page <span className="font-bold text-ink dark:text-ink-dark">{page}</span> of{' '}
            <span className="font-bold text-ink dark:text-ink-dark">{totalPages}</span> ({totalCount} total defaulters)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-ink disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed font-medium"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border border-line bg-surface hover:bg-surface-secondary text-ink disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <DefaulterNoticeModal isOpen={Boolean(activeNotice)} onClose={() => setActiveNotice(null)} defaulter={activeNotice} />
    </div>
  );
};

export default FeeDefaultersPage;
