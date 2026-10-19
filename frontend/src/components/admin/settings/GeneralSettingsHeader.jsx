import { Sliders, Save, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

const GeneralSettingsHeader = ({ settings, isDirty, saving, onSave }) => {
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 lg:-mt-8 mb-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-b border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
          <Sliders className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-ink dark:text-ink-dark tracking-tight">
              General Settings
            </h1>
            {settings?.code && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary">
                <Building className="w-3 h-3" />
                {settings.code}
              </span>
            )}
            {settings?.school_type && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-surface-secondary text-ink-muted">
                <ShieldCheck className="w-3 h-3 text-good" />
                {settings.school_type} School
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-ink-muted">
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
