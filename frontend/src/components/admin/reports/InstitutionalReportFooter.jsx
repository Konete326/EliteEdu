import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const InstitutionalReportFooter = ({
  counters = {},
  showCounters = true,
  showSignatures = true,
  customNote = ''
}) => {
  const { activeCount = 0, registeredCount = 0, inactiveCount = 0, suspendedCount = 0, leftCount = 0 } = counters;

  return (
    <div className="mt-6 pt-3 border-t border-line space-y-4 relative">
      {showCounters && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-secondary/70 border border-line text-xs font-bold">
          <div className="flex items-center gap-1.5 text-good">
            <span className="w-2.5 h-2.5 rounded-full bg-good" />
            <span>ACTIVE: {activeCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-600">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>REGISTERED: {registeredCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-ink-muted">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>INACTIVE: {inactiveCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>SUSPENDED: {suspendedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-bad">
            <span className="w-2.5 h-2.5 rounded-full bg-bad" />
            <span>LEFT: {leftCount}</span>
          </div>
        </div>
      )}

      {customNote && (
        <p className="text-[11px] text-ink-muted italic">{customNote}</p>
      )}

      {showSignatures && (
        <div className="pt-2">
          <OfficialSignatureStampBlock
            showStamp={true}
            showSignature={true}
            signatureTitle="Incharge / Principal"
            stampTitle="Official School Stamp"
          />
        </div>
      )}

      <div className="flex justify-end pt-1">
        <span className="text-[8px] font-bold tracking-widest text-ink-muted/30 select-none uppercase">EliteEdu</span>
      </div>
    </div>
  );
};

export default InstitutionalReportFooter;
