import { Smartphone, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import GlobalComingSoon from '../../../common/GlobalComingSoon';

const StudentAppSettingsTab = () => {
  return (
    <GlobalComingSoon
      title="Student & Parent App Permissions"
      subtitle="Learner & Guardian Mobile Application Controls"
      description="Student and Parent digital app access, feature toggles, and mobile portal permissions are currently being engineered for Milestone 2. Currently, Admin, SuperAdmin, and Teacher panels remain fully operational."
      icon={Smartphone}
      badge="Coming Soon"
      features={[
        {
          title: 'Student Mobile Access',
          desc: 'Personalized app credentials for learner timetable and assignments.',
          icon: Smartphone
        },
        {
          title: 'Parent Portal Sync',
          desc: 'Instant daily attendance notifications and fee invoice tracking.',
          icon: Users
        },
        {
          title: 'Granular Permissions',
          desc: 'Institutional controls for digital marks, diary, and certificate views.',
          icon: ShieldCheck
        },
        {
          title: 'Multi-Device Security',
          desc: 'Biometric authorization and secure single-session sign-in.',
          icon: CheckCircle2
        }
      ]}
    />
  );
};

export default StudentAppSettingsTab;
