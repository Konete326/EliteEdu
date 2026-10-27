import { Award, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function ExamsListPage() {
  const { user } = useAuth();
  const backUrl = user?.role === 'Teacher' ? '/teacher' : '/admin';

  return (
    <GlobalComingSoon
      title="Examination & Assessments"
      subtitle="Institutional Academic Evaluation Studio"
      description="The Examination, Term Scheduling, Date Sheets, Mark Sheets, and Assessment Management module is currently undergoing system upgrade for Milestone 2. Automated date sheet generation, grading policies, and printable report cards will be active soon."
      icon={Award}
      badge="Coming Soon"
      backUrl={backUrl}
      features={[
        {
          title: 'Term & Exam Schedules',
          desc: 'Automated term creation, exam calendars, and student allocations.',
          icon: Calendar
        },
        {
          title: 'Dynamic Date Sheets',
          desc: 'Conflict-free date sheet generation with printable institutional templates.',
          icon: FileText
        },
        {
          title: 'Digital Mark Sheets',
          desc: 'Fast marks entry for teachers with multi-parameter grading scales.',
          icon: Award
        },
        {
          title: 'Report Cards & Analytics',
          desc: 'Term result compilations, subject-wise analytics, and printable cards.',
          icon: CheckCircle2
        }
      ]}
    />
  );
}
