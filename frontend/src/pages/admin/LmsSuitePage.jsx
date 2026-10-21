import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { BookOpen, FileText, Video, Radio, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import api from '../../utils/axiosConfig';
import PrerequisiteGuardBanner from '../../components/common/PrerequisiteGuardBanner';
import MobileStepSlider from '../../components/common/MobileStepSlider';
import LmsHeader from '../../components/admin/lms/LmsHeader';
import LmsKpiStrip from '../../components/admin/lms/LmsKpiStrip';
import LmsSyllabusTab from '../../components/admin/lms/LmsSyllabusTab';
import LmsHomeworkTab from '../../components/admin/lms/LmsHomeworkTab';
import LmsLecturesTab from '../../components/admin/lms/LmsLecturesTab';
import LmsQuizzesTab from '../../components/admin/lms/LmsQuizzesTab';
import LmsLiveClassesTab from '../../components/admin/lms/LmsLiveClassesTab';

const getInitialTab = (pathname, searchTab) => {
  if (['syllabus', 'homework', 'material', 'quizzes', 'live'].includes(searchTab)) {
    return searchTab;
  }
  if (pathname.includes('syllabus') || pathname.includes('courses')) return 'syllabus';
  if (pathname.includes('assignment') || pathname.includes('homework')) return 'homework';
  if (pathname.includes('material') || pathname.includes('lecture')) return 'material';
  if (pathname.includes('quiz')) return 'quizzes';
  if (pathname.includes('live') || pathname.includes('online-classes')) return 'live';
  return 'syllabus';
};

const TABS = [
  { id: 'syllabus', label: 'Courses & Syllabus', icon: BookOpen },
  { id: 'homework', label: 'Homework & Tasks', icon: FileText },
  { id: 'material', label: 'Lectures & Resources', icon: Video },
  { id: 'quizzes', label: 'Online Quizzes', icon: Award },
  { id: 'live', label: 'Live Classrooms', icon: Radio }
];

const LmsSuitePage = () => {
  const { user } = useAuth();
  const { activeCampusId, activeCampus } = useCampus();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const campusFilter = activeCampusId && activeCampusId !== 'all' ? activeCampusId : '';

  const [activeTab, setActiveTab] = useState(() =>
    getInitialTab(location.pathname, searchParams.get('tab'))
  );
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [items, setItems] = useState([]);
  const [kpis, setKpis] = useState({});

  const activeTabIdx = Math.max(0, TABS.findIndex((t) => t.id === activeTab));

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['syllabus', 'homework', 'material', 'quizzes', 'live'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab(getInitialTab(location.pathname, null));
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', tabId);
      return next;
    }, { replace: true });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const campusQuery = campusFilter ? `?campus_id=${campusFilter}` : '';
      const subjectsCampusQuery = campusFilter ? `&campus_id=${campusFilter}` : '';
      const [gRes, sRes, lRes] = await Promise.all([
        api.get(`/grades${campusQuery}`),
        api.get(`/subjects?limit=500${subjectsCampusQuery}`),
        api.get(`/lms${campusQuery}`)
      ]);
      setGrades(gRes.data?.grades || gRes.data || []);
      setSubjects(sRes.data?.subjects || sRes.data || []);
      setItems(lRes.data?.items || []);
      setKpis(lRes.data?.counters || lRes.data?.kpis || {});
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [campusFilter]);

  return (
    <div className="w-full min-h-full flex flex-col gap-3 sm:gap-4">
      <LmsHeader
        campusName={activeCampus?.name}
        onRefresh={loadData}
        loading={loading}
        totalCount={items.length}
      />

      <PrerequisiteGuardBanner
        prerequisites={[
          { label: 'Classes / Grades', count: grades.length, link: '/admin/grades' },
          { label: 'Subjects', count: subjects.length, link: '/admin/subjects' }
        ]}
      />

      <LmsKpiStrip kpis={kpis} onSelectTab={handleTabChange} />

      <div className="shrink-0 print:hidden">
        <MobileStepSlider
          controlledIndex={activeTabIdx}
          onIndexChange={(idx) => handleTabChange(TABS[idx].id)}
          desktopClassName="sm:flex sm:items-center sm:gap-1.5 sm:p-1.5 sm:rounded-2xl sm:border sm:border-line sm:dark:border-line-dark sm:bg-surface sm:dark:bg-surface-dark sm:shadow-xs sm:w-fit sm:min-w-0"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 w-full sm:w-auto ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-secondary dark:hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </MobileStepSlider>
      </div>

      <div className="flex-1 min-h-0">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-16 bg-surface dark:bg-surface-dark rounded-2xl border border-line dark:border-line-dark">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            {activeTab === 'syllabus' && (
              <LmsSyllabusTab
                grades={grades}
                subjects={subjects}
                user={user}
                campusId={campusFilter}
              />
            )}
            {activeTab === 'homework' && (
              <LmsHomeworkTab
                grades={grades}
                subjects={subjects}
                items={items}
                onReload={loadData}
                user={user}
                campusId={campusFilter}
              />
            )}
            {activeTab === 'material' && (
              <LmsLecturesTab
                grades={grades}
                subjects={subjects}
                items={items}
                onReload={loadData}
                user={user}
                campusId={campusFilter}
              />
            )}
            {activeTab === 'quizzes' && (
              <LmsQuizzesTab
                grades={grades}
                subjects={subjects}
                items={items}
                onReload={loadData}
                user={user}
                campusId={campusFilter}
              />
            )}
            {activeTab === 'live' && (
              <LmsLiveClassesTab
                grades={grades}
                subjects={subjects}
                items={items}
                onReload={loadData}
                user={user}
                campusId={campusFilter}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LmsSuitePage;
