import { Database, HardDrive, RefreshCw, ShieldCheck } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function BackupComingSoonPage() {
  return (
    <GlobalComingSoon
      title="System Backup & Recovery Studio"
      subtitle="Institutional Disaster Recovery & Snapshot Hub"
      description="The Automated Database Backup and Recovery Studio is being engineered for Milestone 2. Scheduled daily snapshots, encrypted cloud exports, point-in-time recovery, and one-click data downloads will be available shortly."
      icon={Database}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Automated Snapshots',
          desc: 'Scheduled daily database snapshots with zero disruption to active sessions.',
          icon: Database
        },
        {
          title: 'Encrypted Cloud Storage',
          desc: 'AES-256 encrypted archival on secure institutional backup vaults.',
          icon: ShieldCheck
        },
        {
          title: 'Point-in-Time Restore',
          desc: 'Safe historical recovery to restore system state to any chosen milestone.',
          icon: RefreshCw
        },
        {
          title: 'Local Archive Download',
          desc: 'Export complete institutional databases to secure compressed local files.',
          icon: HardDrive
        }
      ]}
    />
  );
}

