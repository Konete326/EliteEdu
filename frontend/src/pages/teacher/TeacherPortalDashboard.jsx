import { useState, useEffect } from 'react';
import api from '../../services/api';
import TeacherProfileHero from '../../components/teacher/TeacherProfileHero';
import TeacherStatsGrid from '../../components/teacher/TeacherStatsGrid';
import TeacherPermittedActions from '../../components/teacher/TeacherPermittedActions';
import TeacherClassesCard from '../../components/teacher/TeacherClassesCard';
import TeacherStudentsCard from '../../components/teacher/TeacherStudentsCard';
import TeacherRoleScopeCard from '../../components/teacher/TeacherRoleScopeCard';
import TeacherLiveScheduleWidget from '../../components/teacher/timetable/TeacherLiveScheduleWidget';

const TeacherPortalDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get('/teacher-portal/me'),
      api.get('/teacher-portal/my-students').catch(() => ({ data: { students: [] } }))
    ])
      .then(([meRes, studentsRes]) => {
        if (!isMounted) return;
        if (meRes.data?.success) {
          setProfileData(meRes.data);
        }
        if (studentsRes.data?.students) {
          setStudents(studentsRes.data.students);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load faculty portal');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-ink-muted">Authenticating faculty security scope...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-bad/5 border border-bad/20 text-center max-w-md mx-auto space-y-3">
        <h3 className="font-bold text-sm text-bad">Access Restricted</h3>
        <p className="text-xs text-ink-muted">{error}</p>
      </div>
    );
  }

  const teacher = profileData?.teacher || {};
  const permissions = profileData?.permissions || {};
  const customRole = profileData?.custom_role || teacher.custom_role_id || null;
  const classTeacherGrades = profileData?.class_teacher_grades || [];

  const assignedClassesCount = (teacher.class_assignments?.length || 0) + classTeacherGrades.length;
  const activePermissionsCount = customRole?.permissions?.length
    ? customRole.permissions.filter((p) => p.view).length
    : Object.values(permissions).filter((v) => v !== false).length;

  return (
    <div className="w-full space-y-6 min-w-0">
      <TeacherProfileHero teacher={teacher} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6 min-w-0">
          <TeacherStatsGrid
            classesCount={assignedClassesCount}
            subjectsCount={teacher.subjects?.length || 0}
            studentsCount={students.length}
            permissionsCount={activePermissionsCount}
          />

          <TeacherPermittedActions permissions={permissions} customRole={customRole} />

          <TeacherStudentsCard students={students} loading={loading} />
        </div>

        <div className="xl:col-span-4 space-y-6 min-w-0">
          <TeacherLiveScheduleWidget />
          <TeacherClassesCard teacher={teacher} classTeacherGrades={classTeacherGrades} />
          <TeacherRoleScopeCard customRole={customRole} teacher={teacher} />
        </div>
      </div>
    </div>
  );
};

export default TeacherPortalDashboard;
