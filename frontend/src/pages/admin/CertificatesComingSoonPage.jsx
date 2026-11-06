import { FileCheck, Award, Printer, ShieldCheck } from 'lucide-react';
import GlobalComingSoon from '../../components/common/GlobalComingSoon';

export default function CertificatesComingSoonPage() {
  return (
    <GlobalComingSoon
      title="Certificates & Credentials Studio"
      subtitle="Institutional Academic Certification"
      description="The Institutional Certificate and Diploma issuance studio is currently undergoing engineering for Milestone 2. Automated template rendering, verification QR codes, and bulk credential printing will be available shortly."
      icon={FileCheck}
      badge="Coming Soon"
      backUrl="/admin"
      features={[
        {
          title: 'Template Designer',
          desc: 'Customizable institutional certificates for academic, sports, and merit honors.',
          icon: FileCheck
        },
        {
          title: 'QR Verification',
          desc: 'Tamper-proof verifiable QR badges for public validation.',
          icon: ShieldCheck
        },
        {
          title: 'Bulk Generation',
          desc: 'High-speed batch rendering with student dynamic data injection.',
          icon: Printer
        },
        {
          title: 'Issued Records',
          desc: 'Searchable audit archive of all credentials ever issued by the institution.',
          icon: Award
        }
      ]}
    />
  );
}
