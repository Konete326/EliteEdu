import { useState, useEffect } from 'react';
import { Calendar, FileText, Video, DollarSign, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import { useToast } from '../../context/ToastContext';
import StudentSwitcherBar from '../../components/student/StudentSwitcherBar';
import StudentPortalHeader from '../../components/student/StudentPortalHeader';
import StudentOverviewTab from '../../components/student/StudentOverviewTab';
import StudentHomeworkTab from '../../components/student/StudentHomeworkTab';
import StudentLiveLecturesTab from '../../components/student/StudentLiveLecturesTab';
import StudentFeeInvoicesTab from '../../components/student/StudentFeeInvoicesTab';
import StudentExamResultsTab from '../../components/student/StudentExamResultsTab';

const StudentPortalPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isStaff = user?.role === 'Admin' || user?.role === 'Teacher';
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [portalData, setPortalData] = useState(null);

  useEffect(() => {
    if (isStaff) {
      api.get('/students?status=Active&limit=1000&minimal=true').then((res) => {
        const list = res.data?.students || res.data || [];
        setAllStudents(list);
        if (list.length > 0 && !selectedStudentId) setSelectedStudentId(list[0]._id);
      }).catch(() => {});
    }
  }, [isStaff]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const targetId = isStaff ? selectedStudentId : (user?.student_id || user?.id);
      const q = targetId ? `?student_id=${targetId}` : '';
      const res = await api.get(`/student-portal/overview${q}`);
      if (res.data?.success) setPortalData(res.data);
    } catch {
      showToast('Failed to load student portal details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isStaff || selectedStudentId) loadOverview();
  }, [selectedStudentId, isStaff, user?.student_id]);

  const tabs = [
    { id: 'overview', label: 'Overview & Timetable', icon: Calendar },
    { id: 'homework', label: 'Homework & Quizzes', icon: FileText },
    { id: 'live', label: 'Live Classes & Lectures', icon: Video },
    { id: 'fees', label: 'Fee Challans & Dues', icon: DollarSign },
    { id: 'exams', label: 'Exam Results & Attendance', icon: Award }
  ];

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <StudentSwitcherBar
        isStaff={isStaff}
        students={allStudents}
        selectedStudentId={selectedStudentId}
        onSelectStudent={setSelectedStudentId}
      />

      <StudentPortalHeader
        student={portalData?.student}
        attendance={portalData?.attendance}
        invoices={portalData?.invoices}
      />

      <div className="flex border-b border-line dark:border-line-dark overflow-x-auto gap-1 sm:gap-2 pb-px scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'border-primary text-primary dark:text-primary-dark font-black'
                  : 'border-transparent text-ink-muted dark:text-ink-muted-dark hover:text-ink dark:hover:text-ink-dark hover:border-line'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-12 text-center space-y-3 shadow-2xs flex flex-col items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark font-semibold">Loading student portal details...</p>
        </div>
      ) : (
        <div>
          {activeTab === 'overview' && <StudentOverviewTab timetable={portalData?.timetable} lmsItems={portalData?.lmsItems} />}
          {activeTab === 'homework' && <StudentHomeworkTab lmsItems={portalData?.lmsItems} studentId={portalData?.student?._id} onReload={loadOverview} />}
          {activeTab === 'live' && <StudentLiveLecturesTab lmsItems={portalData?.lmsItems} />}
          {activeTab === 'fees' && <StudentFeeInvoicesTab invoices={portalData?.invoices} />}
          {activeTab === 'exams' && <StudentExamResultsTab studentId={portalData?.student?._id} markSheets={portalData?.markSheets} classTests={portalData?.classTests} attendance={portalData?.attendance} />}
        </div>
      )}
    </div>
  );
};

export default StudentPortalPage;
