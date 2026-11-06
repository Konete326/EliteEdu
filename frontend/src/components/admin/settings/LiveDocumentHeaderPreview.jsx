import { useState } from 'react';
import { FileText, CreditCard, School, Building2, CheckCircle, Receipt, ShieldCheck } from 'lucide-react';

const LiveDocumentHeaderPreview = ({ settings }) => {
  const [activeTab, setActiveTab] = useState('letterhead');

  const schoolName = settings.name || 'Elite Edu Higher Secondary School';
  const slogan = settings.slogan || '';
  const contact = settings.contact_number || '';
  const address = settings.address || '';
  const website = settings.website || '';
  const contactLine = [contact, address].filter(Boolean).join(' | ');
  const logo = settings.logo_url;
  const principalSignature = settings.principal_signature_url;
  const teacherSignature = settings.teacher_signature_url;

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <span>Live Document Dynamic Preview</span>
            <span className="w-2 h-2 rounded-full bg-good animate-pulse" />
          </h3>
          <p className="text-[10px] text-ink-muted">
            Instant real-time PDF and vector template rendering
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/70 dark:bg-[#141414] rounded-xl border border-line/60 dark:border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('letterhead')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'letterhead'
              ? 'bg-surface dark:bg-[#1c1c1c] text-primary shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Letterhead</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('idcard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'idcard'
              ? 'bg-surface dark:bg-[#1c1c1c] text-primary shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>ID Card</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('voucher')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'voucher'
              ? 'bg-surface dark:bg-[#1c1c1c] text-primary shadow-xs'
              : 'text-ink-muted hover:text-ink dark:hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Fee Voucher</span>
        </button>
      </div>

      {activeTab === 'letterhead' && (
        <div className="rounded-xl border border-line dark:border-white/15 bg-white text-black p-4 space-y-3 shadow-xs">
          <div className="flex items-center gap-3 border-b-2 border-black/80 pb-3">
            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <School className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black uppercase tracking-tight text-gray-900 line-clamp-1">
                {schoolName}
              </h4>
              {Boolean(slogan) && (
                <p className="text-[10px] font-bold text-teal-700 leading-tight">
                  {slogan}
                </p>
              )}
              {Boolean(contactLine) && (
                <p className="text-[9px] text-gray-600 truncate mt-0.5">{contactLine}</p>
              )}
              {Boolean(website) && (
                <p className="text-[8px] text-gray-500 font-mono truncate">{website}</p>
              )}
            </div>
          </div>

          <div className="text-center py-1">
            <span className="inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black text-white">
              Official Academic Transcript &amp; Character Certificate
            </span>
          </div>

          <div className="pt-4 border-t border-dashed border-gray-300 flex items-end justify-between text-[9px]">
            <div className="text-center">
              {teacherSignature ? (
                <img
                  src={teacherSignature}
                  alt="Exam Authority Signature"
                  className="h-8 max-w-[100px] object-contain mx-auto mb-1"
                />
              ) : (
                <div className="h-8 flex items-center justify-center text-gray-400 font-mono text-[8px]">
                  [Pending Exam Sign]
                </div>
              )}
              <div className="w-24 border-t border-gray-400 pt-0.5 font-bold uppercase text-gray-700">
                Exam Controller
              </div>
            </div>

            <div className="text-center">
              {principalSignature ? (
                <img
                  src={principalSignature}
                  alt="Principal Signature"
                  className="h-8 max-w-[100px] object-contain mx-auto mb-1"
                />
              ) : (
                <div className="h-8 flex items-center justify-center text-gray-400 font-mono text-[8px]">
                  [Pending Principal Sign]
                </div>
              )}
              <div className="w-24 border-t border-gray-400 pt-0.5 font-bold uppercase text-gray-700">
                {settings.principal_name || 'Principal'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'idcard' && (
        <div className="rounded-xl border border-line dark:border-white/15 bg-white text-black overflow-hidden shadow-xs">
          <div className="bg-[#0f3d64] text-white p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <Building2 className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-tight truncate leading-tight">
                {schoolName}
              </p>
              {Boolean(slogan) && (
                <p className="text-[8px] text-blue-100 truncate leading-tight">{slogan}</p>
              )}
            </div>
          </div>
          <div className="p-3 bg-amber-50/50 flex items-center justify-between text-[8px] font-mono text-gray-700 border-b border-amber-200/50">
            <span>REG: {settings.affiliation_number || '408110114'}</span>
            <span className="font-bold text-teal-700">{settings.school_type || 'Private'}</span>
          </div>
          <div className="p-3 text-center text-[10px] text-gray-500 font-medium">
            Standard ISO/IEC 7810 ID-1 (CR80) PVC Card Dimension Format
          </div>
        </div>
      )}

      {activeTab === 'voucher' && (
        <div className="rounded-xl border border-line dark:border-white/15 bg-white text-black p-3 space-y-2 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
                ) : (
                  <Receipt className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-900 leading-tight">
                  {schoolName}
                </p>
                <p className="text-[8px] text-gray-500 font-mono">
                  CURRENCY: {settings.currency || 'PKR'} • {settings.code || 'SCH-001'}
                </p>
              </div>
            </div>
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-gray-900 text-white uppercase">
              Bank Copy
            </span>
          </div>
          <div className="text-[9px] text-gray-600 bg-gray-50 p-2 rounded border border-gray-200 flex justify-between font-mono">
            <span>TUITION FEE: 5,500 {settings.currency || 'PKR'}</span>
            <span className="font-bold text-emerald-700">PAID VIA 1BILL</span>
          </div>
        </div>
      )}

      <div className="p-2.5 rounded-xl bg-good/5 border border-good/20 flex items-center gap-2 text-xs text-good dark:text-good-dark">
        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[10px] font-medium leading-tight">
          All reports, certificates, and ID cards inherit these parameters automatically.
        </span>
      </div>
    </div>
  );
};

export default LiveDocumentHeaderPreview;
