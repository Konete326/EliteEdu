import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, FileText, Video, Radio, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import api from '../../utils/axiosConfig';
import PrerequisiteGuardBanner from '../../components/common/PrerequisiteGuardBanner';
import LmsKpiStrip from '../../components/admin/lms/LmsKpiStrip';
import LmsSyllabusTab from '../../components/admin/lms/LmsSyllabusTab';
import LmsHomeworkTab from '../../components/admin/lms/LmsHomeworkTab';
import LmsLecturesTab from '../../components/admin/lms/LmsLecturesTab';
import LmsQuizzesTab from '../../components/admin/lms/LmsQuizzesTab';
import LmsLiveClassesTab from '../../components/admin/lms/LmsLiveClassesTab';

const getInitialTab = (pathname) => {
  if (pathname.includes('syllabus') || pathname.includes('courses')) return 'syllabus';
  if (pathname.includes('assignment') || pathname.includes('homework')) return 'homework';
  if (pathname.includes('material') || pathname.includes('lecture')) return 'material';
  if (pathname.includes('quiz')) return 'quizzes';
  if (pathname.includes('live') || pathname.includes('online-classes')) return 'live';
  return 'syllabus';
};

const LmsSuitePage = () => {
  const { user } = useAuth();
  const { selectedCampus } = useCampus();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => getInitialTab(location.pathname));
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [items, setItems] = useState([]);
  const [kpis, setKpis] = useState({});

  useEffect(() => {
    setActiveTab(getInitialTab(location.pathname));
  }, [location.pathname]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [gRes, sRes, lRes] = await Promise.all([
        api.get('/grades'),
        api.get('/subjects'),
        api.get(`/lms${selectedCampus ? `?campus_id=${selectedCampus}` : ''}`)
      ]);
      setGrades(gRes.data?.grades || gRes.data || []);
      setSubjects(sRes.data?.subjects || sRes.data || []);
      setItems(lRes.data?.items || []);
      setKpis(lRes.data?.kpis || {});
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedCampus]);

  const tabs = [
    { id: 'syllabus', label: 'Courses & Syllabus', icon: BookOpen },
    { id: 'homework', label: 'Homework & Assignments', icon: FileText },
    { id: 'material', label: 'Lectures & Material', icon: Video },
    { id: 'quizzes', label: 'Online Quizzes', icon: Award },
    { id: 'live', label: 'Live Virtual Classes', icon: Radio }
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Digital Classroom & LMS Studio</h1>
        <p className="text-sm text-gray-500">Manage courses, syllabus tracking, assignments, recorded lectures, and live classes</p>
      </div>

      <PrerequisiteGuardBanner
        prerequisites={[
          { label: 'Classes / Grades', count: grades.length, link: '/admin/grades' },
          { label: 'Subjects', count: subjects.length, link: '/admin/subjects' }
        ]}
      />

      <LmsKpiStrip kpis={kpis} />

      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
      ) : (
        <div>
          {activeTab === 'syllabus' && <LmsSyllabusTab grades={grades} subjects={subjects} user={user} />}
          {activeTab === 'homework' && <LmsHomeworkTab grades={grades} subjects={subjects} items={items} onReload={loadData} user={user} />}
          {activeTab === 'material' && <LmsLecturesTab grades={grades} subjects={subjects} items={items} onReload={loadData} user={user} />}
          {activeTab === 'quizzes' && <LmsQuizzesTab grades={grades} subjects={subjects} items={items} onReload={loadData} user={user} />}
          {activeTab === 'live' && <LmsLiveClassesTab grades={grades} subjects={subjects} items={items} onReload={loadData} user={user} />}
        </div>
      )}
    </div>
  );
};

export default LmsSuitePage;
