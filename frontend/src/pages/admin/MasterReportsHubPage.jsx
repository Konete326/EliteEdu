import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../../services/api';
import { useCampus } from '../../context/CampusContext';
import { useToast } from '../../context/ToastContext';
import MasterReportCategoryNav from '../../components/admin/reports/MasterReportCategoryNav';
import MasterReportFiltersCard from '../../components/admin/reports/MasterReportFiltersCard';
import MasterReportTable from '../../components/admin/reports/MasterReportTable';
import ReportExportToolbar from '../../components/admin/reports/ReportExportToolbar';
import InstitutionalReportHeader from '../../components/admin/reports/InstitutionalReportHeader';
import InstitutionalReportFooter from '../../components/admin/reports/InstitutionalReportFooter';
import { MASTER_REPORT_COLS } from '../../components/admin/reports/masterReportCols';
import { REPORT_CATEGORIES } from '../../components/admin/reports/masterReportCategoriesConfig';

const MasterReportsHubPage = () => {
  const { activeCampusId } = useCampus();
  const [grades, setGrades] = useState([]);
  const [exams, setExams] = useState([]);
  const [activeCategory, setActiveCategory] = useState('student');
  const [subReport, setSubReport] = useState('master_list');
  const [filters, setFilters] = useState({ academic_session: '2026-2027', grade_id: 'all', section: 'all', gender: 'all', status: 'all', religion: 'all' });
  const [data, setData] = useState([]);
  const [counters, setCounters] = useState({});
  const [header, setHeader] = useState({});
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState(MASTER_REPORT_COLS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');

  const toast = useToast();
  const loadReport = useCallback(async () => {
    try {
      setLoading(true);
      const isStudent = activeCategory === 'student';
      const endpoint = isStudent ? '/reports/student-master' : '/reports/category-data';
      const params = isStudent
        ? { ...filters, sub_report: subReport, campus_id: activeCampusId }
        : { category: activeCategory, sub_report: subReport, ...filters, campus_id: activeCampusId };
      const res = await api.get(endpoint, { params });
      if (res.data?.success) {
        const rows = res.data.data || [];
        setData(rows);
        if (res.data.columns?.length) setColumns(res.data.columns);
        else if (isStudent && subReport === 'master_list') setColumns(MASTER_REPORT_COLS);
        setCounters(res.data.counters || {});
        setHeader(res.data.header || {});
        if (rows.length === 0) toast.info('No records found for current filters.');
      }
    } catch {
      setData([]);
      toast.error('Failed to compile report. Please check filters.');
    } finally {
      setLoading(false);
    }
  }, [activeCampusId, activeCategory, filters, subReport, toast]);

  useEffect(() => {
    api.get('/grades').then((r) => setGrades(r.data?.grades || r.data || [])).catch(() => {});
    api.get('/exams').then((r) => setExams(r.data?.exams || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { loadReport(); }, [loadReport]);

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    const cat = REPORT_CATEGORIES.find((c) => c.id === catId);
    if (cat?.subReports?.length) setSubReport(cat.subReports[0].id);
    setPage(1);
  };

  const filteredRows = useMemo(() => {
    if (!searchTerm) return data;
    const s = searchTerm.toLowerCase();
    return data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
  }, [data, searchTerm]);

  return (
    <div className="w-full space-y-4">
      <div className="print:hidden space-y-1">
        <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Reports &gt; Master Studio</div>
        <h1 className="text-xl sm:text-2xl font-black text-ink">Institutional Reports Studio</h1>
      </div>
      <div className="hidden print:block"><InstitutionalReportHeader header={header} reportTitle={`${activeCategory.toUpperCase()} REPORT`} academicSession={filters.academic_session} /></div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-3">
          <MasterReportCategoryNav
            activeSubReport={subReport}
            onSelectSubReport={(s) => { setSubReport(s); setPage(1); }}
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        <div className="xl:col-span-9 space-y-4">
          <MasterReportFiltersCard
            category={activeCategory} subReport={subReport} filters={filters}
            onFilterChange={(k, v) => setFilters((p) => ({ ...p, [k]: v }))}
            grades={grades} exams={exams} onGenerate={loadReport}
            onReset={() => {
              setFilters({ academic_session: '2026-2027', grade_id: 'all', section: 'all', gender: 'all', status: 'all', religion: 'all' });
              loadReport();
            }}
            loading={loading}
          />
          <div className="p-4 rounded-2xl bg-surface border border-line shadow-2xs space-y-3">
            <ReportExportToolbar
              columns={columns} rows={filteredRows} filename={`${activeCategory}-${subReport}-report`}
              onToggleColumn={(k) => setColumns((p) => p.map((c) => (c.key === k ? { ...c, visible: !c.visible } : c)))}
              pageSize={pageSize} onPageSizeChange={setPageSize} searchTerm={searchTerm} onSearchChange={setSearchTerm}
            />
            <MasterReportTable columns={columns} rows={filteredRows} page={page} pageSize={pageSize} onPageChange={setPage} />
            <InstitutionalReportFooter counters={counters} showCounters={true} showSignatures={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterReportsHubPage;
