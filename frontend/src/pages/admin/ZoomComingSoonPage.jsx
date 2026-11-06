import { Video, Key, Shield, Radio } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function ZoomComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Zoom Integration Studio"
      subtitle="Virtual Classrooms & Remote Conferencing"
      description="The Zoom API Video Conferencing and Virtual Classroom Integration module is being engineered for Milestone 2. Automated meeting generation, attendance sync, and teacher host provisioning will be active soon."
      icon={Video}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Direct API Connect',
          desc: 'Seamless OAuth2 integration with school Zoom business accounts.',
          icon: Key
        },
        {
          title: 'Auto-Scheduling',
          desc: 'Automatic meeting creation synced directly with the academic timetable.',
          icon: Radio
        },
        {
          title: 'Attendee Tracking',
          desc: 'Automated attendance verification for students attending virtual classes.',
          icon: Shield
        },
        {
          title: 'Class Recordings',
          desc: 'Secure cloud archive linking class recordings to student LMS portals.',
          icon: Video
        }
      ]}
    />
  );
}
