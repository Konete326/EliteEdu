import { CheckCircle2, User, Clock, QrCode } from 'lucide-react';

const LastScannedSpotlight = ({ student, scanTime }) => {
  if (!student) {
    return (
      <div className="p-8 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-dashed border-line dark:border-line-dark flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <QrCode className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-bold text-ink dark:text-ink-dark">Ready for Card Scanning</h3>
        <p className="text-xs text-ink-muted max-w-sm">
          Scan Student ID Card QR / Barcode or type GR #. Scanned details will immediately appear here.
        </p>
      </div>
    );
  }

  const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface to-surface dark:from-emerald-500/10 dark:via-surface-dark dark:to-surface-dark border border-emerald-500/30 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Marked Present</span>
        </span>
        <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-500" />
          <span>{scanTime || new Date().toLocaleTimeString()}</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-primary">
          {student.photo_url ? (
            <img src={student.photo_url} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-10 h-10" />
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <h2 className="text-lg font-black text-ink dark:text-ink-dark truncate">{fullName}</h2>
          <div className="text-xs text-ink-muted">
            Father: <span className="font-semibold text-ink dark:text-ink-dark">{student.father_name || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
              GR: {student.gr_number || 'N/A'}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark">
              {student.current_grade?.name || 'Class'} {student.section ? `(${student.section})` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastScannedSpotlight;
