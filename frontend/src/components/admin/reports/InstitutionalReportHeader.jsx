import { GraduationCap } from 'lucide-react';

const InstitutionalReportHeader = ({
  header = {},
  reportTitle = 'STUDENTS MASTER REPORT',
  subtitle = '',
  academicSession = '2026-2027',
  filterSummary = ''
}) => {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="mb-4 pb-3 border-b-2 border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {header.logoUrl ? (
            <img src={header.logoUrl} alt="Logo" className="w-14 h-14 object-contain rounded-lg" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <GraduationCap size={28} />
            </div>
          )}
          <div>
            <h1 className="text-lg font-black text-ink uppercase tracking-wide">
              {header.schoolName || 'Elite Educational System'}
            </h1>
            <p className="text-xs font-semibold text-ink-muted">
              {header.campusName || 'Main Campus'} {header.campusPhone ? `• Cell: ${header.campusPhone}` : ''}
            </p>
            {header.campusAddress && (
              <p className="text-[11px] text-ink-muted">{header.campusAddress}</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            {reportTitle}
          </span>
          <p className="text-[11px] text-ink-muted mt-1 font-medium">
            Session: <span className="font-bold text-ink">{academicSession}</span>
          </p>
          <p className="text-[10px] text-ink-muted">
            Printed: {currentDate}, {currentTime}
          </p>
        </div>
      </div>

      {(subtitle || filterSummary) && (
        <div className="mt-2 text-xs font-semibold text-ink-sub flex items-center justify-between">
          <span>{subtitle}</span>
          {filterSummary && <span className="text-ink-muted text-[11px]">{filterSummary}</span>}
        </div>
      )}
    </div>
  );
};

export default InstitutionalReportHeader;
