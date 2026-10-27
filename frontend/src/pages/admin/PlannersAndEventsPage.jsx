import { Calendar, BookOpen, Clock, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

const PlannersAndEventsPage = () => {
  const { user } = useAuth();
  const backUrl = user?.role === 'Teacher' ? '/teacher' : '/admin';

  return (
    <GlobalComingSoon
      title="Academic Planners & Events Studio"
      subtitle="Curriculum Pacing, Lesson Planning, Activity Calendars & School Events"
      description="The Academic Planners and Events module is currently under active engineering for Milestone 2. Automated lesson plans, syllabus pacing guides, teacher planners, and school activity calendars will be available soon."
      icon={Calendar}
      badge="Coming Soon"
      backUrl={backUrl}
      features={[
        {
          title: 'Lesson Planners',
          desc: 'Structured day-wise instructional lesson preparation, materials, and learning goals.',
          icon: BookOpen
        },
        {
          title: 'Annual Events Calendar',
          desc: 'Institutional academic timeline, term milestones, public holidays, and parent days.',
          icon: Calendar
        },
        {
          title: 'Activity Planners',
          desc: 'Extracurricular workshops, science exhibitions, sports galas, and school activities.',
          icon: Clock
        },
        {
          title: 'Curriculum Pacing',
          desc: 'Track unit coverage against academic deadlines to ensure consistent curriculum progress.',
          icon: Target
        }
      ]}
    />
  );
};

export default PlannersAndEventsPage;
