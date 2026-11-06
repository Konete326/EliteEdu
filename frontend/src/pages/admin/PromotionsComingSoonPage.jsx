import { TrendingUp, Users, CheckSquare, Layers } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function PromotionsComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Student Academic Promotions"
      subtitle="Annual Session Progression & Class Upgrades"
      description="The Student Academic Promotion and Class Transfer module is currently undergoing system optimization for Milestone 2. Automated batch grade promotions, section roll-overs, and session transitions will be active soon."
      icon={TrendingUp}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Batch Grade Upgrades',
          desc: 'One-click promotion of entire classes to the next academic grade.',
          icon: TrendingUp
        },
        {
          title: 'Section Re-Allocation',
          desc: 'Automated redistribution of students across sections based on capacity.',
          icon: Layers
        },
        {
          title: 'Performance Filters',
          desc: 'Promote students conditionally based on passing criteria and attendance.',
          icon: CheckSquare
        },
        {
          title: 'Session Roll-over',
          desc: 'Seamless migration of fee records and academic profiles to new sessions.',
          icon: Users
        }
      ]}
    />
  );
}

