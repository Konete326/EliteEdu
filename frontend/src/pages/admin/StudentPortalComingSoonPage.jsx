import { GraduationCap, BookOpen, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function StudentPortalComingSoonPage() {
  const { user } = useAuth();
  const backUrl = user?.role === 'Teacher' ? '/teacher' : user?.role === 'SuperAdmin' ? '/superadmin' : '/admin';

  return (
    <GlobalComingSoon
      title="Student & Parent Portal"
      subtitle="Learner & Guardian Digital Access Hub"
      description="The Student and Parent Digital Access Portals are currently being engineered for Milestone 2. Currently, Admin, SuperAdmin, and Teacher portals remain fully active."
      icon={GraduationCap}
      badge="Coming Soon"
      backUrl={backUrl}
      features={[
        {
          title: 'Academic Dashboard',
          desc: 'Personalized timetable, subject teacher contacts, and institutional notices.',
          icon: BookOpen
        },
        {
          title: 'Homework & LMS',
          desc: 'Submit assignments, download lecture notes, and take quizzes.',
          icon: Calendar
        },
        {
          title: 'Assessment Records',
          desc: 'Term marks, exam date sheets, and digital progress reports.',
          icon: Award
        },
        {
          title: 'Fee Invoices',
          desc: 'Instant fee voucher views and transaction history for parents.',
          icon: GraduationCap
        }
      ]}
    />
  );
}
