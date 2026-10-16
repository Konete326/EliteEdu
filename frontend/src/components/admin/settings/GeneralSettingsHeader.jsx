import { Sliders, Save, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

const GeneralSettingsHeader = ({ settings, isDirty, saving, onSave }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface/95 dark:bg-[#0c0c0c]/95 backdrop-blur-md border border-line dark:border-white/10 shadow-xs">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-primary-soft dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-dark shrink-0">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-ink dark:text-ink-dark">
              General Settings
            </h1>
            {settings?.code && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-dark">
                <Building className="w-3 h-3" />
                {settings.code}
              </span>
            )}
            {settings?.school_type && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-secondary dark:bg-white/10 text-ink-sub dark:text-ink-sub-dark">
                <ShieldCheck className="w-3 h-3 text-good" />
                {settings.school_type} School
              </span>
            )}
          </div>
          <p className="text-xs text-ink-muted dark:text-ink-muted-dark">
            Manage institutional identity, official report credentials, and dynamic PDF templates
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isDirty
              ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 hover:scale-[1.02]'
              : 'bg-primary/80 hover:bg-primary text-white'
          } disabled:opacity-50 cursor-pointer`}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isDirty ? (
            <Save className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : isDirty ? 'Save Changes' : 'Saved'}</span>
        </button>
      </div>
    </div>
  );
};

export default GeneralSettingsHeader;
