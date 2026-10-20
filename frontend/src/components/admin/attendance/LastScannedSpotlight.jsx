import React from 'react';
import { CheckCircle2, User, Clock, QrCode, ShieldCheck } from 'lucide-react';

const LastScannedSpotlight = ({ student, scanTime }) => {
  if (!student) {
    return (
      <div className="h-full min-h-[440px] lg:min-h-[580px] p-8 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-dashed border-line dark:border-line-dark flex flex-col items-center justify-center text-center space-y-3">
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
    <div className="h-full min-h-[440px] lg:min-h-[580px] p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface to-surface dark:from-emerald-500/10 dark:via-surface-dark dark:to-surface-dark border border-emerald-500/30 shadow-md flex flex-col justify-between space-y-4">
      <div className="space-y-4">
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

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left pt-2">
          <div className="w-24 h-24 rounded-2xl bg-surface dark:bg-surface-dark border-2 border-emerald-500/40 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-primary">
            {student.photo_url ? (
              <img src={student.photo_url} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>

          <div className="space-y-1.5 min-w-0">
            <h2 className="text-xl font-black text-ink dark:text-ink-dark truncate">{fullName}</h2>
            <div className="text-xs text-ink-muted">
              Father: <span className="font-semibold text-ink dark:text-ink-dark">{student.father_name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 flex-wrap justify-center sm:justify-start">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                GR: {student.gr_number || 'N/A'}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark">
                {student.current_grade?.name || 'Class'} {student.section ? `(${student.section})` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-surface-secondary/60 dark:bg-white/5 border border-line dark:border-white/10 text-xs text-ink-muted flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Biometric &amp; Card Verification Active</span>
        </span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">Recorded Live</span>
      </div>
    </div>
  );
};

export default LastScannedSpotlight;
