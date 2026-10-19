import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import api from '../../services/api';
import BehaviorKpiStrip from '../../components/admin/behavior/BehaviorKpiStrip';
import BehaviorFilterSidebar from '../../components/admin/behavior/BehaviorFilterSidebar';
import BehaviorMatrixTable from '../../components/admin/behavior/BehaviorMatrixTable';
import { useBehaviorClassSheet } from '../../components/admin/behavior/useBehaviorClassSheet';

const BehaviorSkillsPage = () => {
  const navigate = useNavigate();
  const { selectedCampus } = useCampus();
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [term, setTerm] = useState('Mid Term');
  const [session, setSession] = useState('2026-2027');

  useEffect(() => {
    api.get('/grades').then((res) => {
      const list = res.data?.grades || res.data?.data || res.data || [];
      setGrades(list);
      if (list.length) setSelectedGrade(list[0]._id);
    }).catch(() => {});
  }, [selectedCampus]);

  const {
    students, evaluations, kpis, loading, saving,
    handleRatingChange, handleConductChange, handleObservationChange, handleSetAll, handleSave
  } = useBehaviorClassSheet(selectedGrade, selectedSection, term, session, selectedCampus);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Award className="w-6 h-6 text-blue-600" /> Affective & Psychomotor Behavior Studio
        </h1>
        <p className="text-xs text-gray-500">Holistic student character evaluation, psychomotor practical skills, and report card auto-sync</p>
      </div>

      <BehaviorKpiStrip kpis={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-3">
          <BehaviorFilterSidebar
            grades={grades}
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            term={term}
            onTermChange={setTerm}
            session={session}
            onSessionChange={setSession}
            onSetAllRatings={handleSetAll}
            onSave={handleSave}
            saving={saving}
          />
        </div>
        <div className="lg:col-span-9">
          <BehaviorMatrixTable
            students={students}
            evaluations={evaluations}
            onChangeRating={handleRatingChange}
            onChangeConduct={handleConductChange}
            onChangeObservation={handleObservationChange}
            onViewReportCard={(id) => navigate(`/admin/reports/report-cards?studentId=${id}`)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default BehaviorSkillsPage;
