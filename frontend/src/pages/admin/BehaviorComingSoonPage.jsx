import { Award, ShieldCheck, HeartHandshake, UserCheck } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function BehaviorComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Behavior & Skills Assessment"
      subtitle="Holistic Student Evaluation Studio"
      description="The Student Behavior, Soft Skills, and Conduct Evaluation module is being upgraded for Milestone 2. Term skill matrices, teacher evaluations, and behavior report entries will be active shortly."
      icon={Award}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Skill Matrix',
          desc: 'Customizable evaluation criteria for soft skills and social conduct.',
          icon: ShieldCheck
        },
        {
          title: 'Teacher Reviews',
          desc: 'Fast qualitative remarks entry for class teachers and subject faculty.',
          icon: UserCheck
        },
        {
          title: 'Counseling Logs',
          desc: 'Confidential mentoring notes and behavioral guidance history.',
          icon: HeartHandshake
        },
        {
          title: 'Report Cards',
          desc: 'Automated inclusion of behavioral scores on printable student cards.',
          icon: Award
        }
      ]}
    />
  );
}

