import React from 'react';
import ReportCardStyle1YellowPermanent from './ReportCardStyle1YellowPermanent';
import ReportCardStyle2NavyModernBlocks from './ReportCardStyle2NavyModernBlocks';
import ReportCardStyle3CrimsonExecutive from './ReportCardStyle3CrimsonExecutive';
import ReportCardStyle4SkyBlueCrest from './ReportCardStyle4SkyBlueCrest';
import ReportCardStyle5EmeraldElementary from './ReportCardStyle5EmeraldElementary';
import ReportCardStyle6CreamBehaviorGrid from './ReportCardStyle6CreamBehaviorGrid';
import ReportCardClassicInstitutional from './ReportCardClassicInstitutional';

const ReportCardRenderer = ({
  template = 'yellow_permanent',
  orientation = 'portrait',
  student = {},
  header = {},
  examResults = [],
  testResults = [],
  academicSummary = {},
  remarks = {},
  attendance = {},
  behaviorRecord = null
}) => {
  const commonProps = {
    student,
    header,
    examResults,
    testResults,
    academicSummary,
    remarks,
    attendance,
    behaviorRecord,
    orientation
  };

  const renderActiveTemplate = () => {
    switch (template) {
      case 'navy_modern_blocks':
        return <ReportCardStyle2NavyModernBlocks {...commonProps} />;
      case 'crimson_executive':
        return <ReportCardStyle3CrimsonExecutive {...commonProps} />;
      case 'sky_blue_crest':
        return <ReportCardStyle4SkyBlueCrest {...commonProps} />;
      case 'emerald_elementary':
        return <ReportCardStyle5EmeraldElementary {...commonProps} />;
      case 'cream_behavior_grid':
        return <ReportCardStyle6CreamBehaviorGrid {...commonProps} />;
      case 'classic_institutional':
        return <ReportCardClassicInstitutional {...commonProps} />;
      case 'yellow_permanent':
      default:
        return <ReportCardStyle1YellowPermanent {...commonProps} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            size: A4 ${orientation};
            margin: 6mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #printable-report-card {
            width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>
      <div
        id="printable-report-card"
        className={`w-full transition-all duration-200 ${
          orientation === 'landscape' ? 'max-w-[297mm]' : 'max-w-[210mm]'
        }`}
      >
        {renderActiveTemplate()}
      </div>
    </div>
  );
};

export default ReportCardRenderer;
