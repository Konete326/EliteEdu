import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, X, Copy, Check, Printer, Download, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  subHeading = '',
  customSlogan = '',
  customBody = '',
  resolvedBody = '',
  issueDate = new Date().toISOString().split('T')[0],
  signatoryTitle1 = 'Teacher In-Charge',
  signatoryTitle2 = 'Principal / Headmaster',
  showStamp = true,
  showQr = true,
  onPrint,
  onDownloadPdf
}) => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 420 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const normStyle = normalizeDesignStyle(style || template.design_style);
  const isPortrait = orientation === 'portrait';
  const baseWidth = isPortrait ? 594 : 840;
  const baseHeight = isPortrait ? 840 : 594;
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify/certificate/${certificateNo}`;

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0) {
          setContainerSize({
            width: clientWidth,
            height: clientHeight > 0 ? clientHeight : 420
          });
        }
      }
    };
    updateSize();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height > 0 ? entry.contentRect.height : 420
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const isDesktop = containerSize.width >= 580;
  const availW = Math.max(260, containerSize.width - 12);
  const availH = isDesktop ? Math.max(280, containerSize.height - 12) : 340;
  const scaleByW = availW / baseWidth;
  const scaleByH = availH / baseHeight;
  const fitScale = isDesktop ? Math.min(scaleByW, scaleByH) : scaleByW;
  const effectiveScale = Math.max(0.25, Math.min(1.6, Number((fitScale * zoomLevel).toFixed(3))));
  const scaledWidth = Math.round(baseWidth * effectiveScale);
  const scaledHeight = Math.round(baseHeight * effectiveScale);

  const missingFields = [];
  if (recipientType === 'Student' && (recipient?._id || recipient?.name)) {
    if (!recipient.father_name || !recipient.father_name.trim()) missingFields.push("Father's Name");
    if (!recipient.dob && !recipient.date_of_birth) missingFields.push("Date of Birth");
    if (!recipient.gr_number) missingFields.push("GR Number");
    if (!recipient.current_grade) missingFields.push("Class Grade");
  } else if (recipientType === 'Staff' && (recipient?._id || recipient?.name)) {
    if (!recipient.designation) missingFields.push("Designation");
    if (!recipient.employee_code && !recipient.personal_id) missingFields.push("Employee Code");
  }

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      subHeading,
      customSlogan,
      customBody,
      resolvedBody: customBody || resolvedBody,
      issueDate,
      orientation,
      signatoryTitle1,
      signatoryTitle2,
      showStamp,
      showQr
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

  const fullscreenScale = typeof window !== 'undefined'
    ? Math.min((window.innerWidth * 0.9) / baseWidth, (window.innerHeight * 0.8) / baseHeight)
    : 1;

  return (
    <div className="w-full h-full flex flex-col items-center gap-2 select-none">
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
            transform: none !important;
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

      <div className="w-full flex flex-wrap items-center justify-between gap-1.5 px-3 py-1.5 rounded-xl bg-surface dark:bg-surface-dark border border-line dark:border-line-dark shadow-2xs print:hidden text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-ink dark:text-ink-dark flex items-center gap-1.5">
            <Eye size={13} className="text-primary shrink-0" />
            <span className="truncate">A4 Certificate Preview</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-surface-secondary text-[10px] font-mono text-ink-muted uppercase shrink-0">
            {isPortrait ? 'Portrait' : 'Landscape'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center rounded-lg border border-line p-0.5 bg-surface-secondary/40">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded text-ink-muted hover:text-ink cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold text-ink min-w-[32px] text-center">
              {Math.round(effectiveScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded text-ink-muted hover:text-ink cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-1.5 py-0.5 text-[10px] font-bold text-ink-muted hover:text-primary cursor-pointer border-l border-line"
              title="Reset Zoom to Fit"
            >
              Fit
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors cursor-pointer"
            title="Copy Public Verification Link"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors cursor-pointer"
            title="Fullscreen Preview"
          >
            <Maximize2 size={13} />
          </button>

          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="p-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
              title="Download High-Res PDF"
            >
              <Download size={13} />
            </button>
          )}

          {onPrint && (
            <button
              type="button"
              onClick={onPrint}
              className="p-1.5 rounded-lg border border-line hover:bg-surface-secondary text-ink-muted hover:text-ink transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Printer size={13} />
            </button>
          )}
        </div>
      </div>

      {missingFields.length > 0 ? (
        <div className="w-full flex items-center justify-between gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-medium print:hidden shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Missing:</strong> {missingFields.join(', ')} — incomplete for official printing.
            </span>
          </div>
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md shrink-0">
            Incomplete
          </span>
        </div>
      ) : recipient && (recipient._id || recipient.name) ? (
        <div className="w-full flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10.5px] font-semibold print:hidden shrink-0">
          <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">Recipient record complete and verified for physical printing.</span>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="w-full flex-1 flex items-center justify-center overflow-auto p-1 min-h-[250px] xl:min-h-0 custom-scrollbar"
      >
        <div
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            position: 'relative'
          }}
          className="shrink-0 transition-[width,height] duration-150 rounded-2xl shadow-xl overflow-hidden border border-slate-300 dark:border-slate-800 bg-white"
        >
          <div
            id="printable-certificate"
            style={{
              width: `${baseWidth}px`,
              height: `${baseHeight}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            {renderDesign()}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 text-white">
            <span className="font-bold text-sm">
              Fullscreen Preview — {certificateNo}
            </span>
            <div className="flex items-center gap-2">
              {onDownloadPdf && (
                <button
                  type="button"
                  onClick={onDownloadPdf}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Download PDF
                </button>
              )}
              {onPrint && (
                <button
                  type="button"
                  onClick={onPrint}
                  className="px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} /> Print
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div
            style={{
              width: `${Math.round(baseWidth * fullscreenScale)}px`,
              height: `${Math.round(baseHeight * fullscreenScale)}px`,
              position: 'relative'
            }}
            className="rounded-2xl shadow-2xl overflow-hidden border border-white/20 bg-white"
          >
            <div
              style={{
                width: `${baseWidth}px`,
                height: `${baseHeight}px`,
                transform: `scale(${fullscreenScale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0
              }}
            >
              {renderDesign()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificatePreviewCanvas;