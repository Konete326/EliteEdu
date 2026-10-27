import { ShieldCheck, MessageSquareWarning, HeartHandshake, FileCheck, PackageSearch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

const CampusOperationsPage = () => {
  const { user } = useAuth();
  const backUrl = user?.role === 'Teacher' ? '/teacher' : '/admin';

  return (
    <GlobalComingSoon
      title="Campus Operations & Student Welfare Hub"
      subtitle="Complaints Desk, Student Counseling, Parental Consent & Lost and Found"
      description="Campus Operations Hub is currently under active engineering for Milestone 2. Incident tracking, student counseling notes, parental consent slips, and lost & found workflows will be active shortly."
      icon={ShieldCheck}
      badge="Coming Soon"
      backUrl={backUrl}
      features={[
        {
          title: 'Complaints Redressal',
          desc: 'Transparent grievance intake, escalation workflows, and resolution notes for staff & parents.',
          icon: MessageSquareWarning
        },
        {
          title: 'Student Counseling',
          desc: 'Confidential behavioral and emotional guidance logs maintained securely by school counselors.',
          icon: HeartHandshake
        },
        {
          title: 'Parental Consent Slips',
          desc: 'Paperless authorization requests for field trips, sports activities, and school declarations.',
          icon: FileCheck
        },
        {
          title: 'Lost & Found Desk',
          desc: 'Centralized registry to report found articles, match claims, and track rightful handovers.',
          icon: PackageSearch
        }
      ]}
    />
  );
};

export default CampusOperationsPage;
