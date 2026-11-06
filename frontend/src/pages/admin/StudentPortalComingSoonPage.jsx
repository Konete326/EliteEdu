import { GraduationCap, BookOpen, Calendar, Award } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function StudentPortalComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Student Portal Studio"
      subtitle="Learner Academic & Activity Hub"
      description="The Student Portal environment is being engineered for Milestone 2. Student timetables, digital homework submissions, grade cards, and fee status will be available soon."
      icon={GraduationCap}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Academic Dashboard',
          desc: 'Personalized timetable, subject teacher contacts, and notices.',
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
          desc: 'Instant fee voucher views and transaction history.',
          icon: GraduationCap
        }
      ]}
    />
  );
}

