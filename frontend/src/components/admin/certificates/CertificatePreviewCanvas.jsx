import React from 'react';
import { normalizeDesignStyle } from './CertificateDesigns';
import Design1AcademicGoldHatch from './designs/Design1AcademicGoldHatch';
import Design2FloralCornerFiligree from './designs/Design2FloralCornerFiligree';
import Design3GuillocheRosette from './designs/Design3GuillocheRosette';
import Design4NavyRibbonHalftone from './designs/Design4NavyRibbonHalftone';

const CertificatePreviewCanvas = ({
  certificateNo = 'CERT-2026-0001',
  template = {},
  style = 'academic_gold_hatch',
  orientation = 'landscape',
  accentColor = '#b59449',
  school = {},
  campus = {},
  recipient = {},
  recipientType = 'Student',
  customText = '',
  customHeading = '',
  customBody = '',
  resolvedBody = '',
  issueDate = new Date().toISOString().split('T')[0]
}) => {
  const normStyle = normalizeDesignStyle(style || template.design_style);
  const isPortrait = orientation === 'portrait';

  const renderDesign = () => {
    const commonProps = {
      certificateNo,
      template,
      school,
      campus,
      recipient,
      recipientType,
      customText,
      customHeading,
      customBody,
      resolvedBody: customBody || resolvedBody,
      issueDate,
      orientation
    };
    switch (normStyle) {
      case 'floral_corner_filigree':
        return <Design2FloralCornerFiligree {...commonProps} />;
      case 'guilloche_rosette_burgundy':
        return <Design3GuillocheRosette {...commonProps} />;
      case 'navy_ribbon_halftone':
        return <Design4NavyRibbonHalftone {...commonProps} />;
      case 'academic_gold_hatch':
      default:
        return <Design1AcademicGoldHatch {...commonProps} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <style>{`
        @media print {
          @page {
            size: A4 ${isPortrait ? 'portrait' : 'landscape'};
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #printable-certificate {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            page-break-after: avoid;
            page-break-inside: avoid;
            z-index: 99999;
          }
        }
      `}</style>
      <div
        id="printable-certificate"
        className={`w-full overflow-hidden transition-all duration-200 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-800 print:shadow-none print:m-0 print:rounded-none ${
          isPortrait ? 'max-w-[680px] aspect-[1/1.414]' : 'max-w-[960px] aspect-[1.414/1]'
        }`}
      >
        {renderDesign()}
      </div>
    </div>
  );
};

export default CertificatePreviewCanvas;
