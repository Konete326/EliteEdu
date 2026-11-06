import { BarChart3, Users, UserCheck, CalendarCheck } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function ReportsComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Institutional Reports & Analytics"
      subtitle="Comprehensive Data Hub & Reporting Studio"
      description="The Institutional Reporting and Analytics Studio is currently undergoing scheduled engineering for Milestone 2. Advanced demographic aggregations, attendance roll-ups, and printable report sheets will be available shortly."
      icon={BarChart3}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Student Analytics',
          desc: 'Comprehensive enrollment, demographic, and grade distribution metrics.',
          icon: Users
        },
        {
          title: 'Staff Profiles',
          desc: 'Department-wise staffing, subject allocation, and workload statistics.',
          icon: UserCheck
        },
        {
          title: 'Attendance Summaries',
          desc: 'Institutional attendance trends, chronic absenteeism, and alerts.',
          icon: CalendarCheck
        },
        {
          title: 'Export Studio',
          desc: 'High-speed CSV, Excel, and institutional PDF report generation.',
          icon: BarChart3
        }
      ]}
    />
  );
}
