import React from 'react';
import { CheckCircle2, User, Clock, QrCode, ShieldCheck } from 'lucide-react';

const LastScannedSpotlight = ({ student, scanTime }) => {
  if (!student) {
    return (
      <div className="h-full min-h-[180px] sm:min-h-[360px] lg:min-h-[580px] p-4 sm:p-8 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-dashed border-line dark:border-line-dark flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <QrCode className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <h3 className="text-xs sm:text-sm font-bold text-ink dark:text-ink-dark">Ready for Card Scanning</h3>
        <p className="text-[11px] sm:text-xs text-ink-muted max-w-sm">
          Scan Student ID Card QR / Barcode or type GR #. Scanned details will immediately appear here.
        </p>
      </div>
    );
  }

  const fullName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';

  return (
    <div className="h-full min-h-[190px] sm:min-h-[360px] lg:min-h-[580px] p-3.5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface to-surface dark:from-emerald-500/10 dark:via-surface-dark dark:to-surface-dark border border-emerald-500/30 shadow-xs flex flex-col justify-between space-y-3 sm:space-y-4">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-black bg-emerald-500 text-white shadow-xs">
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Marked Present</span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-ink-muted flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span>{scanTime || new Date().toLocaleTimeString()}</span>
          </span>
        </div>

        <div className="flex flex-row items-center sm:items-start gap-3 sm:gap-4 text-left pt-1">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center text-primary">
            {student.photo_url ? (
              <img src={student.photo_url} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 sm:w-12 sm:h-12" />
            )}
          </div>

          <div className="space-y-1 min-w-0">
            <h2 className="text-base sm:text-xl font-black text-ink dark:text-ink-dark truncate">{fullName}</h2>
            <div className="text-[11px] sm:text-xs text-ink-muted">
              Father: <span className="font-semibold text-ink dark:text-ink-dark">{student.father_name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5 flex-wrap justify-start">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                GR: {student.gr_number || 'N/A'}
              </span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark">
                {student.current_grade?.name || 'Class'} {student.section ? `(${student.section})` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2.5 sm:p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-white/5 border border-line dark:border-white/10 text-[10px] sm:text-xs text-ink-muted flex items-center justify-between">
        <span className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Biometric &amp; Card Verification Active</span>
        </span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">Recorded Live</span>
      </div>
    </div>
  );
};

export default LastScannedSpotlight;
