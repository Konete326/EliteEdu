import React from 'react';
import { Award, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';
import { getDesignClasses } from './CertificateDesigns';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';
import { renderSvgQrCode } from '../../../utils/idCardCodeGenerator';

const CertificatePreviewCanvas = ({
  certificateNo = 'CERT-2026-0001',
  template = {},
  style = 'royal_gold',
  accentColor = '#0d9488',
  school = {},
  campus = {},
  recipient = {},
  recipientType = 'Student',
  customText = '',
  resolvedBody = '',
  issueDate = new Date().toISOString().split('T')[0]
}) => {
  const d = getDesignClasses(style, accentColor);
  const verifyUrl = `${window.location.origin}/verify/certificate/${certificateNo}`;
  const schoolName = (school.name || campus.name || 'ELITE EDUCATIONAL SYSTEM').toUpperCase();
  const campusSub = campus.name ? `${campus.name} ${campus.address ? `— ${campus.address}` : ''}` : 'Main Campus';
  const motto = school.slogan || 'پڑھے گا سندھ بڑھے گا سندھ';
  const logo = school.logo_url || campus.logo || '/logo.png';

  return (
    <div id="printable-certificate" className={`w-full max-w-[210mm] min-h-[148mm] rounded-2xl shadow-md overflow-hidden relative print:shadow-none print:w-full print:m-0 print:rounded-none select-none ${d.outerBorder}`}>
      <div className={`rounded-xl h-full flex flex-col justify-between relative ${d.innerBorder}`}>
        <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="School Logo" className="w-12 h-12 object-contain rounded-full bg-white/20 p-1 shrink-0" />
            <div className="text-left">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 dark:text-white leading-tight">{schoolName}</h2>
              <p className="text-[10px] text-slate-500 font-semibold">{campusSub}</p>
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">{motto}</p>
            </div>
          </div>
          <div className="text-right text-[10px] font-mono space-y-0.5 shrink-0">
            <div className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold text-slate-800 dark:text-slate-200">
              SERIAL: <span className="font-bold text-primary">{certificateNo}</span>
            </div>
            <div className="text-slate-500 flex items-center justify-end gap-1">
              <Calendar size={11} /> <span>{issueDate}</span>
            </div>
          </div>
        </div>

        <div className="py-4 text-center space-y-3 relative">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-2xs" style={{ backgroundColor: d.highlightColor, color: '#ffffff' }}>
            <Award size={14} /> {template.heading || 'CERTIFICATE OF ACHIEVEMENT'}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {template.sub_heading || 'THIS IS TO CERTIFY THAT'}
          </p>

          <div className="max-w-2xl mx-auto px-4">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-justify sm:text-center">
              {resolvedBody || template.body_template || 'Certificate body content goes here...'}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-white rounded border border-black/10 shrink-0">
              {renderSvgQrCode(verifyUrl, 44)}
            </div>
            <div className="text-[9px] font-mono text-left leading-tight text-slate-500">
              <p className="font-bold text-slate-700 dark:text-slate-300">Scan to Verify Authenticity</p>
              <p className="text-[8px] opacity-80">Govt. Registered Institutional Record</p>
            </div>
          </div>

          <div className="flex-1 flex justify-center w-full sm:w-auto">
            <OfficialSignatureStampBlock />
          </div>

          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 select-none self-end sm:self-auto shrink-0">
            <GraduationCap className="w-3 h-3 text-primary" />
            <span>EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewCanvas;
