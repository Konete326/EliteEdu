import { X, Building2 } from 'lucide-react';

const CampusModalHeader = ({ modalTitle, mode, logoToShow, onClose }) => {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-line dark:border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-secondary/70 dark:bg-white/5 border border-line dark:border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {logoToShow ? (
            <img
              src={logoToShow}
              alt={mode === 'add' ? 'EliteEdu Logo' : 'Campus Logo'}
              onError={(e) => { e.currentTarget.src = '/logo.png'; }}
              className="w-full h-full object-contain p-1 rounded-xl"
            />
          ) : (
            <Building2 className="w-5 h-5 text-primary dark:text-primary-dark" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">{modalTitle}</h3>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            {mode === 'view' ? 'View campus configuration' : 'Enter campus details and credentials'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CampusModalHeader;
