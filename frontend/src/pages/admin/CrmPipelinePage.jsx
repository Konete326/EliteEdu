import { Users, Filter, PhoneCall, BarChart3 } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function CrmPipelinePage() {
  return (
    <GlobalComingSoon
      title="Admissions CRM & Inquiries"
      subtitle="Student Lead Generation & Enrollment Studio"
      description="The Admissions CRM module is currently undergoing system upgrade for Milestone 2. Walk-in inquiries, applicant pipeline tracking, automated follow-up scheduling, and admission conversion analytics will be active soon."
      icon={Users}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Inquiries Management',
          desc: 'Multi-channel inquiry recording with campus source attribution.',
          icon: Users
        },
        {
          title: 'Admission Pipeline',
          desc: 'Visual lead stages from initial contact to enrolled student.',
          icon: Filter
        },
        {
          title: 'Automated Follow-ups',
          desc: 'Automated reminders and scheduled calls for parent inquiries.',
          icon: PhoneCall
        },
        {
          title: 'Conversion Analytics',
          desc: 'Inquiry-to-admission metrics and performance KPIs.',
          icon: BarChart3
        }
      ]}
    />
  );
}
