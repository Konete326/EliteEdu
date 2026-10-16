import { useState } from 'react';
import { FileText, CreditCard, School, Building2, CheckCircle } from 'lucide-react';

const LiveDocumentHeaderPreview = ({ settings }) => {
  const [activeTab, setActiveTab] = useState('letterhead');

  const schoolName = settings.name || 'Elite Edu Higher Secondary School';
  const slogan = settings.slogan || '';
  const contact = settings.contact_number || '';
  const address = settings.address || '';
  const website = settings.website || '';
  const contactLine = [contact, address].filter(Boolean).join(' | ');
  const logo = settings.logo_url;

  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4 sticky top-6">
      <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
        <div>
          <h3 className="text-sm font-bold text-ink dark:text-ink-dark flex items-center gap-2">
            <span>Live Document Preview</span>
            <span className="w-2 h-2 rounded-full bg-good animate-pulse" />
          </h3>
          <p className="text-[11px] text-ink-muted">Real-time PDF header rendering</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/70 dark:bg-[#141414] rounded-xl border border-line/60 dark:border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('letterhead')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'letterhead' ? 'bg-surface dark:bg-[#1c1c1c] text-primary shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Letterhead</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('idcard')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'idcard' ? 'bg-surface dark:bg-[#1c1c1c] text-primary shadow-xs' : 'text-ink-muted hover:text-ink'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>ID Card Header</span>
        </button>
      </div>

      {activeTab === 'letterhead' ? (
        <div className="rounded-xl border border-line dark:border-white/15 bg-white text-black p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-3 border-b-2 border-black/80 pb-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <School className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black uppercase tracking-tight text-gray-900 line-clamp-1">{schoolName}</h4>
              {Boolean(slogan) && <p className="text-[11px] font-bold text-teal-700 font-urdu leading-tight">{slogan}</p>}
              {Boolean(contactLine) && <p className="text-[9px] text-gray-600 truncate mt-0.5">{contactLine}</p>}
              {Boolean(website) && <p className="text-[8px] text-gray-500 font-mono truncate">{website}</p>}
            </div>
          </div>
          <div className="text-center py-1">
            <span className="inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black text-white">
              Official Admission Record & Letter
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-line dark:border-white/15 bg-white text-black overflow-hidden shadow-xs">
          <div className="bg-[#0f3d64] text-white p-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-0.5" />
              ) : (
                <Building2 className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-tight truncate leading-tight">{schoolName}</p>
              {Boolean(slogan) && <p className="text-[8px] text-blue-100 truncate leading-tight">{slogan}</p>}
            </div>
          </div>
          <div className="p-3 bg-amber-50/50 flex items-center justify-between text-[8px] font-mono text-gray-700 border-b border-amber-200/50">
            <span>REG: {settings.affiliation_number || '408110114'}</span>
            <span className="font-bold text-teal-700">{settings.school_type || 'Private'}</span>
          </div>
        </div>
      )}

      <div className="p-3 rounded-xl bg-good/5 border border-good/20 flex items-center gap-2 text-xs text-good dark:text-good-dark">
        <CheckCircle className="w-4 h-4 shrink-0" />
        <span className="text-[11px] font-medium leading-tight">All PDF exports dynamically inherit these values instantly.</span>
      </div>
    </div>
  );
};

export default LiveDocumentHeaderPreview;
