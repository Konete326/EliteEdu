import { Bus, MapPin, Users, Navigation } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function TransportComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Transport & Fleet Management"
      subtitle="Institutional Logistics & Fleet Studio"
      description="The Transport and Fleet Management module is being upgraded for Milestone 2. Vehicle registrations, route mapping, driver allocations, and student transport rosters will be active shortly."
      icon={Bus}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Fleet Tracking',
          desc: 'Vehicle capacity, maintenance schedules, and registration details.',
          icon: Bus
        },
        {
          title: 'Route Mapping',
          desc: 'Optimized bus routes with designated pickup and drop-off points.',
          icon: MapPin
        },
        {
          title: 'Driver Rosters',
          desc: 'Licensed driver assignments and contact management.',
          icon: Navigation
        },
        {
          title: 'Student Allocation',
          desc: 'Roster linking students to specific bus routes and fee plans.',
          icon: Users
        }
      ]}
    />
  );
}

