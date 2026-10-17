import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { useNotification } from '../../context/NotificationContext';
import ResultsHeaderAndTabs from '../../components/admin/classtests/results/ResultsHeaderAndTabs';
import ClassWiseReportTab from '../../components/admin/classtests/results/ClassWiseReportTab';
import ClassSubjectReportTab from '../../components/admin/classtests/results/ClassSubjectReportTab';
import StudentSubjectReportTab from '../../components/admin/classtests/results/StudentSubjectReportTab';
import DateRangeReportTab from '../../components/admin/classtests/results/DateRangeReportTab';
import PerformanceAnalyticsTab from '../../components/admin/classtests/results/PerformanceAnalyticsTab';
import StudentReportPrintModal from '../../components/admin/classtests/results/StudentReportPrintModal';

export default function ClassTestResultsPage() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('class_wise');
  const [prereqs, setPrereqs] = useState({ grades: [], subjects: [] });
  const [students, setStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().substring(0, 10);
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportToPrint, setReportToPrint] = useState(null);

  useEffect(() => {
    axios.get('/api/class-tests/prerequisites').then((res) => {
      if (res.data?.success) {
        setPrereqs(res.data);
        if (res.data.grades?.length > 0) setSelectedGrade(res.data.grades[0]._id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedGrade) { setStudents([]); return; }
    axios.get(`/api/students?grade_id=${selectedGrade}&status=Active&limit=100`).then((res) => {
      setStudents(res.data?.students || []);
    }).catch(() => {});
  }, [selectedGrade]);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ mode: activeTab });
      if (selectedGrade) params.append('grade_id', selectedGrade);
      if (selectedSection && selectedSection !== 'All') params.append('section', selectedSection);
      if (selectedSubject) params.append('subject_id', selectedSubject);
      if (selectedStudent) params.append('student_id', selectedStudent);
      if (activeTab === 'date_range') {
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
      }
      const res = await axios.get(`/api/class-tests/analytics?${params.toString()}`);
      if (res.data?.success) setAnalyticsData(res.data);
    } catch {
      showNotification('Failed to load analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeTab, selectedGrade, selectedSection, selectedSubject, selectedStudent, fromDate, toDate]);

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      <ResultsHeaderAndTabs activeTab={activeTab} setActiveTab={setActiveTab} onPrint={() => window.print()} />

      {activeTab === 'class_wise' && <ClassWiseReportTab grades={prereqs.grades} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedSection={selectedSection} setSelectedSection={setSelectedSection} data={analyticsData} isLoading={isLoading} onPrintSlip={(row) => setReportToPrint({ student: row, tests: analyticsData?.tests?.filter((t) => (t.marks || []).some((m) => String(m.student_id) === String(row.student_id))) || [], avgPct: row.percentage, overallGrade: row.grade_letter })} />}
      {activeTab === 'class_subject' && <ClassSubjectReportTab grades={prereqs.grades} subjects={prereqs.subjects} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} selectedSection={selectedSection} setSelectedSection={setSelectedSection} data={analyticsData} isLoading={isLoading} />}
      {activeTab === 'student_subject' && <StudentSubjectReportTab grades={prereqs.grades} subjects={prereqs.subjects} students={students} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} data={analyticsData} isLoading={isLoading} onPrintStudentReport={(card) => setReportToPrint(card)} />}
      {activeTab === 'date_range' && <DateRangeReportTab grades={prereqs.grades} selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} data={analyticsData} isLoading={isLoading} onDrilldownTest={(test) => navigate('/admin/class-tests/manage')} />}
      {activeTab === 'performance' && <PerformanceAnalyticsTab data={analyticsData} isLoading={isLoading} />}

      <StudentReportPrintModal isOpen={Boolean(reportToPrint)} onClose={() => setReportToPrint(null)} reportData={reportToPrint} />
    </div>
  );
}
