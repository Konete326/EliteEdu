import { Trash2, AlertTriangle } from 'lucide-react';

const ProfileDangerZoneCard = ({ onOpenModal, schoolName }) => {
  return (
    <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-500/20 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Danger Zone: Purge All School Data</span>
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed max-w-xl">
            Permanently delete all students, teachers, staff accounts, attendance records, circulars, and fee invoices registered under <strong className="text-ink dark:text-ink-dark">{schoolName || 'this school'}</strong>. Your administrator login remains intact.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenModal}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-red-500/20 transition-all cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete All School Data</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDangerZoneCard;
