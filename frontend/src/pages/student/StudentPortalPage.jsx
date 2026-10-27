import { useState, useEffect } from 'react';
import { Calendar, FileText, Video, DollarSign, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/axiosConfig';
import StudentSwitcherBar from '../../components/student/StudentSwitcherBar';
import StudentPortalHeader from '../../components/student/StudentPortalHeader';
import StudentOverviewTab from '../../components/student/StudentOverviewTab';
import StudentFeeInvoicesTab from '../../components/student/StudentFeeInvoicesTab';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

const StudentPortalPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isStaff = user?.role === 'Admin' || user?.role === 'SuperAdmin' || user?.role === 'Teacher';

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
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
    { id: 'homework', label: 'Homework & LMS', icon: FileText, badge: 'Coming Soon' },
    { id: 'live', label: 'Live Classrooms', icon: Video, badge: 'Coming Soon' },
    { id: 'fees', label: 'Fee Challans & Dues', icon: DollarSign },
    { id: 'exams', label: 'Exam Results & Attendance', icon: Award, badge: 'Coming Soon' }
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
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                  {tab.badge}
                </span>
              )}
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
          {activeTab === 'homework' && (
            <GlobalComingSoon
              title="Homework & LMS Studio"
              subtitle="Student Digital Learning Space"
              description="Your digital homework assignments, lecture notes, study materials, and online quizzes will appear here once the LMS module is launched."
              icon={FileText}
              badge="Coming Soon"
              features={[
                { title: 'Digital Assignments', desc: 'Submit homework and view teacher marks and remarks directly.' },
                { title: 'Lecture Notes', desc: 'Download class study materials and reference guides.' },
                { title: 'Interactive Quizzes', desc: 'Practice mock tests and chapter assessments online.' }
              ]}
            />
          )}
          {activeTab === 'live' && (
            <GlobalComingSoon
              title="Live Virtual Classrooms"
              subtitle="Interactive Online Learning"
              description="Live virtual lectures, interactive screen sharing, and recorded revision sessions are being integrated and will be available shortly."
              icon={Video}
              badge="Coming Soon"
              features={[
                { title: 'Live Lectures', desc: 'Join online classes directly from your student portal.' },
                { title: 'Recorded Archive', desc: 'Rewatch past classroom lectures anytime for revision.' }
              ]}
            />
          )}
          {activeTab === 'fees' && <StudentFeeInvoicesTab invoices={portalData?.invoices} />}
          {activeTab === 'exams' && (
            <GlobalComingSoon
              title="Examination & Assessments"
              subtitle="Student Results & Grade Records"
              description="Term exam datesheets, online marks, award lists, and printable term report cards will be released here once the examination cycle begins."
              icon={Award}
              badge="Coming Soon"
              features={[
                { title: 'Exam Date Sheets', desc: 'View complete exam schedules and syllabus breakdowns.' },
                { title: 'Progress Report Cards', desc: 'Download and print institutional term assessment cards.' }
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPortalPage;
