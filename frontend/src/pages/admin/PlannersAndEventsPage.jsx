import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PlannerHeader from '../../components/admin/planners/PlannerHeader';
import PlannerForm from '../../components/admin/planners/PlannerForm';
import PlannerCardList from '../../components/admin/planners/PlannerCardList';
import PrintablePlannerSheetModal from '../../components/admin/planners/PrintablePlannerSheetModal';
import PrerequisiteGuardBanner from '../../components/common/PrerequisiteGuardBanner';
import api from '../../services/api';

const resolveTab = (pathname) => {
  if (pathname.includes('/events')) return 'Events_Calendar';
  return 'Lesson_Plan';
};

const PlannersAndEventsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => resolveTab(location.pathname));
  const [records, setRecords] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    setActiveTab(resolveTab(location.pathname));
  }, [location.pathname]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const q = activeTab === 'Lesson_Plan' ? '?record_type=Lesson_Plan' : '';
      const [recRes, gRes, sRes, tRes] = await Promise.all([
        api.get(`/planners${q}`),
        api.get('/grades').catch(() => ({ data: [] })),
        api.get('/subjects').catch(() => ({ data: [] })),
        api.get('/teachers').catch(() => ({ data: [] }))
      ]);
      const raw = recRes.data?.data || [];
      setRecords(activeTab === 'Lesson_Plan' ? raw.filter((r) => r.record_type === 'Lesson_Plan') : raw.filter((r) => r.record_type !== 'Lesson_Plan'));
      setGrades(gRes.data?.grades || gRes.data || []);
      setSubjects(sRes.data?.subjects || sRes.data || []);
      setTeachers(tRes.data?.teachers || tRes.data || []);
    } catch {} finally { setLoading(false); }
  }, [activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/planners/${id}`, { status });
      loadData();
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/planners/${id}`);
      loadData();
    } catch {}
  };

  const inProgressCount = records.filter((r) => r.status === 'In_Progress').length;
  const completedCount = records.filter((r) => r.status === 'Completed').length;

  return (
    <div className="w-full space-y-5">
      <PlannerHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={{ total: records.length, inProgress: inProgressCount, completed: completedCount }}
        onPrint={() => setShowPrintModal(true)}
      />

      <PrerequisiteGuardBanner prerequisites={[
        { label: 'Classes / Grades', count: grades.length, link: '/admin/grades' },
        { label: 'Subjects', count: subjects.length, link: '/admin/subjects' },
        { label: 'Teachers', count: teachers.length, link: '/admin/teachers' }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 xl:col-span-4">
          <PlannerForm
            activeTab={activeTab}
            editingRecord={editingRecord}
            onCancelEdit={() => setEditingRecord(null)}
            onSaved={loadData}
            grades={grades}
            subjects={subjects}
            teachers={teachers}
          />
        </div>
        <div className="lg:col-span-7 xl:col-span-8">
          <PlannerCardList
            records={records}
            onStatusChange={handleStatusChange}
            onEdit={setEditingRecord}
            onDelete={handleDelete}
            loading={loading}
            activeTab={activeTab}
            grades={grades}
          />
        </div>
      </div>

      <PrintablePlannerSheetModal
        records={records}
        activeTab={activeTab}
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </div>
  );
};

export default PlannersAndEventsPage;
