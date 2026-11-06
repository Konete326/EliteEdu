import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function BulkImportComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Bulk Data Import Studio"
      subtitle="High-Speed Institutional Data Onboarding"
      description="The Bulk Excel & CSV Data Import Studio is currently undergoing upgrade for Milestone 2. High-speed multi-entity onboarding, smart column mapping, schema validation, and rollback capabilities will be available shortly."
      icon={UploadCloud}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Multi-Entity Import',
          desc: 'One-click import for students, staff, attendance archives, and fee histories.',
          icon: FileSpreadsheet
        },
        {
          title: 'Smart Column Mapping',
          desc: 'Automated header detection and data type inference for uploaded spreadsheets.',
          icon: UploadCloud
        },
        {
          title: 'Validation & Preview',
          desc: 'Pre-flight data consistency checks to catch duplicate records before saving.',
          icon: AlertCircle
        },
        {
          title: 'Atomic Migration',
          desc: 'Instant rollback support ensuring data integrity in case of upload errors.',
          icon: CheckCircle2
        }
      ]}
    />
  );
}

