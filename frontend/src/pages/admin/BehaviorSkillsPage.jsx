import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCampus } from '../../context/CampusContext';
import api from '../../services/api';
import BehaviorKpiStrip from '../../components/admin/behavior/BehaviorKpiStrip';
import BehaviorFilterSidebar from '../../components/admin/behavior/BehaviorFilterSidebar';
import BehaviorMatrixTable from '../../components/admin/behavior/BehaviorMatrixTable';
import { useBehaviorClassSheet } from '../../components/admin/behavior/useBehaviorClassSheet';

const BehaviorSkillsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedCampus } = useCampus();
  const isTeacher = user?.role === 'Teacher';
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('A');
  const [term, setTerm] = useState('Mid Term');
  const [session, setSession] = useState('2026-2027');
  const [teacherTimetableSlots, setTeacherTimetableSlots] = useState([]);

  useEffect(() => {
    if (isTeacher) {
      api.get('/teacher-portal/me').then((res) => {
        const assigned = res.data?.assigned_grades || [];
        const ctGrades = res.data?.class_teacher_grades || [];
        const slots = res.data?.timetable_slots || [];
        const substitutions = res.data?.substitutions || [];
        const allSlots = [...slots, ...substitutions];
        setTeacherTimetableSlots(allSlots);

        const taggedGrades = assigned.map((g) => {
          const isCt = ctGrades.some((cg) => String(cg._id) === String(g._id));
          return {
            ...g,
            is_class_teacher: isCt
          };
        });

        setGrades(taggedGrades);
        if (taggedGrades.length > 0 && (!selectedGrade || !taggedGrades.some((g) => g._id === selectedGrade))) {
          setSelectedGrade(taggedGrades[0]._id);
        }
      }).catch(() => {});
    } else {
      api.get('/grades').then((res) => {
        const list = res.data?.grades || res.data?.data || res.data || [];
        setGrades(list);
        if (list.length && (!selectedGrade || !list.some((g) => g._id === selectedGrade))) {
          setSelectedGrade(list[0]._id);
        }
      }).catch(() => {});
    }
  }, [selectedCampus, isTeacher]);

  const currentGradeObj = useMemo(() => grades.find((g) => g._id === selectedGrade), [grades, selectedGrade]);

  const dynamicSections = useMemo(() => {
    if (isTeacher && selectedGrade) {
      const isCt = grades.find((g) => g._id === selectedGrade)?.is_class_teacher;
      const assignedSecs = teacherTimetableSlots
        .filter((ts) => String(ts.grade_id?._id || ts.grade_id) === String(selectedGrade))
        .map((ts) => ts.section)
        .filter(Boolean);

      if (assignedSecs.length > 0) {
        if (isCt && currentGradeObj?.sections?.length > 0) {
          return Array.from(new Set([...assignedSecs, ...currentGradeObj.sections]));
        }
        return Array.from(new Set(assignedSecs));
      }
    }
    if (currentGradeObj?.sections && currentGradeObj.sections.length > 0) {
      return currentGradeObj.sections;
    }
    return ['A', 'B', 'C', 'D'];
  }, [currentGradeObj, isTeacher, teacherTimetableSlots, selectedGrade, grades]);

  useEffect(() => {
    if (dynamicSections.length > 0 && !dynamicSections.includes(selectedSection)) {
      setSelectedSection(dynamicSections[0]);
    }
  }, [dynamicSections, selectedSection]);

  const {
    students, evaluations, kpis, loading, saving,
    handleRatingChange, handleConductChange, handleObservationChange,
    handleQuickRateStudent, handleSetAll, handleSave, handleSaveSingleStudent
  } = useBehaviorClassSheet(selectedGrade, selectedSection, term, session, selectedCampus);

  return (
    <div className="w-full h-full flex flex-col space-y-3 min-h-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Affective &amp; Psychomotor Behavior Studio
          </h1>
          <p className="text-[11px] text-ink-muted dark:text-ink-muted-dark">
            {isTeacher
              ? 'Student behavior and skills evaluation for your assigned classes and periods'
              : 'Holistic student character evaluation, psychomotor practical skills, and report card auto-sync'}
          </p>
        </div>
        {currentGradeObj && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark text-xs font-semibold text-ink-muted dark:text-ink-muted-dark">
            <span>
              Class: <strong className="text-ink dark:text-ink-dark">{currentGradeObj.name} ({selectedSection})</strong>
            </span>
            {currentGradeObj.is_class_teacher && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck size={12} /> Class In-charge
              </span>
            )}
          </div>
        )}
      </div>

      <BehaviorKpiStrip kpis={kpis} />

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-stretch overflow-hidden">
        <div className="xl:col-span-3 h-full overflow-y-auto flex flex-col min-h-0">
          <BehaviorFilterSidebar
            grades={grades}
            selectedGrade={selectedGrade}
            onGradeChange={setSelectedGrade}
            sections={dynamicSections}
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
        <div className="xl:col-span-9 h-full flex flex-col min-h-0 overflow-hidden">
          <BehaviorMatrixTable
            students={students}
            evaluations={evaluations}
            onChangeRating={handleRatingChange}
            onChangeConduct={handleConductChange}
            onChangeObservation={handleObservationChange}
            onQuickRateStudent={handleQuickRateStudent}
            onSaveSingleStudent={handleSaveSingleStudent}
            onSaveAll={handleSave}
            onViewReportCard={(id) => navigate(`/admin/reports/report-cards?studentId=${id}`)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default BehaviorSkillsPage;
