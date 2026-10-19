import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useCampus } from '../../context/CampusContext';
import ReportCardStudentSelector from '../../components/admin/reports/ReportCardStudentSelector';
import ReportCardTemplateToolbar from '../../components/admin/reports/reportcards/ReportCardTemplateToolbar';
import ReportCardRenderer from '../../components/admin/reports/reportcards/ReportCardRenderer';

const StudentReportCardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeCampusId } = useCampus();
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState('all');
  const [search, setSearch] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [template, setTemplate] = useState(() => {
    try { return localStorage.getItem('eliteedu_reportcard_style') || 'yellow_permanent'; } catch { return 'yellow_permanent'; }
  });
  const [orientation, setOrientation] = useState(() => {
    try { return localStorage.getItem('eliteedu_reportcard_orientation') || 'portrait'; } catch { return 'portrait'; }
  });

  const selectedStudentId = searchParams.get('studentId') || (students[0]?._id ? String(students[0]._id) : '');

  const fetchStudents = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await api.get('/students', { params: { campus_id: activeCampusId, grade_id: grade, search, limit: 100 } });
      const list = res.data?.students || res.data || [];
      setStudents(list);
      if (!searchParams.get('studentId') && list.length > 0) setSearchParams({ studentId: list[0]._id });
    } catch {
      setStudents([]);
    } finally {
      setLoadingList(false);
    }
  }, [activeCampusId, grade, search, searchParams, setSearchParams]);

  const fetchReportCard = useCallback(async (stId) => {
    if (!stId) return;
    try {
      setLoadingCard(true);
      const res = await api.get(`/reports/student-report-card/${stId}`);
      if (res.data?.success) setReportData(res.data);
    } catch {
      setReportData(null);
    } finally {
      setLoadingCard(false);
    }
  }, []);

  useEffect(() => {
    api.get('/grades').then((r) => setGrades(r.data?.grades || r.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);
  useEffect(() => { if (selectedStudentId) fetchReportCard(selectedStudentId); }, [selectedStudentId, fetchReportCard]);

  return (
    <div className="w-full space-y-4">
      <div className="print:hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Reports &gt; Student Progress Report Card</div>
          <h1 className="text-xl sm:text-2xl font-black text-ink dark:text-ink-dark">Student Terminal Report Card Studio</h1>
        </div>
        <button type="button" onClick={() => fetchReportCard(selectedStudentId)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line bg-surface text-ink hover:bg-surface-secondary text-xs font-bold transition-all shadow-2xs cursor-pointer">
          <RefreshCw size={13} className={loadingCard ? 'animate-spin' : ''} />
          <span>Reload</span>
        </button>
      </div>

      <ReportCardTemplateToolbar selectedTemplate={template} onSelectTemplate={setTemplate} orientation={orientation} onToggleOrientation={setOrientation} onPrint={() => window.print()} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        <div className="lg:col-span-4 w-full print:hidden">
          <ReportCardStudentSelector students={students} selectedStudentId={selectedStudentId} onSelectStudent={(id) => setSearchParams({ studentId: id })} grades={grades} selectedGrade={grade} onGradeChange={setGrade} searchTerm={search} onSearchChange={setSearch} loading={loadingList} />
        </div>
        <div className="lg:col-span-8 w-full">
          <div className="p-2 sm:p-4 rounded-2xl bg-surface border border-line shadow-sm print:p-0 print:border-none print:shadow-none w-full">
            {loadingCard ? (
              <div className="py-24 text-center text-xs text-ink-muted">Loading student academic profile...</div>
            ) : !reportData ? (
              <div className="py-24 text-center text-xs text-ink-muted">Select a student to view their report card.</div>
            ) : (
              <ReportCardRenderer
                template={template} orientation={orientation} student={reportData.student} header={reportData.header}
                examResults={reportData.examResults} testResults={reportData.testResults} academicSummary={reportData.academicSummary}
                remarks={reportData.remarks} attendance={reportData.attendance} behaviorRecord={reportData.behaviorRecord}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReportCardPage;
