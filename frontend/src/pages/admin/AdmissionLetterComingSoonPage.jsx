import { FileText, Mail, Stamp, Printer } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function AdmissionLetterComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Admission Letter Studio"
      subtitle="Official Enrollment Documentation"
      description="The Official Admission Letter Generation Studio is currently undergoing scheduled upgrade for Milestone 2. Automated fee schedules, terms and conditions injection, official school seal integration, and one-click PDF generation will be active soon."
      icon={FileText}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Official Letters',
          desc: 'Branded admission welcome letters with dynamic student particulars.',
          icon: FileText
        },
        {
          title: 'Fee Structure Injection',
          desc: 'Automated integration of assigned fee category and initial payment details.',
          icon: Mail
        },
        {
          title: 'Principal Stamps',
          desc: 'Official institutional seals and principal digital signature overlays.',
          icon: Stamp
        },
        {
          title: 'Instant PDF',
          desc: 'High-resolution printable PDF download and direct email dispatch.',
          icon: Printer
        }
      ]}
    />
  );
}

