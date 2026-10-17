import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Printer, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useCampus } from '../../context/CampusContext';
import ReportCardStudentSelector from '../../components/admin/reports/ReportCardStudentSelector';
import ReportCardHeaderStrip from '../../components/admin/reports/ReportCardHeaderStrip';
import ReportCardMarksTable from '../../components/admin/reports/ReportCardMarksTable';
import ReportCardSummaryStrip from '../../components/admin/reports/ReportCardSummaryStrip';

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

  useEffect(() => {
    if (selectedStudentId) fetchReportCard(selectedStudentId);
  }, [selectedStudentId, fetchReportCard]);

  return (
    <div className="w-full space-y-4">
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">Reports &gt; Student Progress Report Card</div>
          <h1 className="text-xl sm:text-2xl font-black text-ink">Student Terminal Report Card Studio</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => fetchReportCard(selectedStudentId)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line bg-surface text-ink hover:bg-surface-secondary text-xs font-bold transition-all shadow-2xs cursor-pointer">
            <RefreshCw size={13} className={loadingCard ? 'animate-spin' : ''} />
            <span>Reload</span>
          </button>
          <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm cursor-pointer">
            <Printer size={14} />
            <span>Print Report Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full">
        <div className="lg:col-span-4 w-full">
          <ReportCardStudentSelector
            students={students} selectedStudentId={selectedStudentId} onSelectStudent={(id) => setSearchParams({ studentId: id })}
            grades={grades} selectedGrade={grade} onGradeChange={setGrade} searchTerm={search} onSearchChange={setSearch} loading={loadingList}
          />
        </div>

        <div className="lg:col-span-8 w-full">
          <div className="p-5 sm:p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4 print:p-0 print:border-none print:shadow-none w-full">
            {loadingCard ? (
              <div className="py-24 text-center text-xs text-ink-muted">Loading student academic profile...</div>
            ) : !reportData ? (
              <div className="py-24 text-center text-xs text-ink-muted">Select a student to view their report card.</div>
            ) : (
              <>
                <ReportCardHeaderStrip student={reportData.student} header={reportData.header} />
                <ReportCardMarksTable examResults={reportData.examResults} testResults={reportData.testResults} />
                <ReportCardSummaryStrip academicSummary={reportData.academicSummary} attendance={reportData.attendance} remarks={reportData.remarks} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentReportCardPage;
