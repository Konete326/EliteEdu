import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

const MarkSheetSettingsTab = () => {
  const [includePractical, setIncludePractical] = useState(true);
  const [showRank, setShowRank] = useState(true);
  const [autoInjectSignatures, setAutoInjectSignatures] = useState(true);
  const [passingThreshold, setPassingThreshold] = useState(33);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('exam_settings_prefs', JSON.stringify({
      includePractical, showRank, autoInjectSignatures, passingThreshold
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 shadow-xs max-w-2xl">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">Exam Result & Printing Rules</h3>
        <p className="text-xs text-slate-400">Configure global calculation policies and automated print injections.</p>
      </div>

      <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800 dark:text-white block">Include Practical Marks</span>
            <span className="text-[11px] text-slate-400">Aggregate theory and practical components into final mark percentages.</span>
          </div>
          <input type="checkbox" checked={includePractical} onChange={(e) => setIncludePractical(e.target.checked)} className="rounded text-primary focus:ring-0 cursor-pointer h-4 w-4" />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800 dark:text-white block">Display Positions & Rank</span>
            <span className="text-[11px] text-slate-400">Show student class rank on individual report cards and gazette tables.</span>
          </div>
          <input type="checkbox" checked={showRank} onChange={(e) => setShowRank(e.target.checked)} className="rounded text-primary focus:ring-0 cursor-pointer h-4 w-4" />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800 dark:text-white block">Auto-Inject Signatures & Stamps</span>
            <span className="text-[11px] text-slate-400">Automatically stamp and sign printed award sheets with active institutional signatures.</span>
          </div>
          <input type="checkbox" checked={autoInjectSignatures} onChange={(e) => setAutoInjectSignatures(e.target.checked)} className="rounded text-primary focus:ring-0 cursor-pointer h-4 w-4" />
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="font-semibold text-slate-800 dark:text-white block">Standard Passing Threshold (%)</span>
            <span className="text-[11px] text-slate-400">Minimum overall percentage to qualify as passed.</span>
          </div>
          <input type="number" min="0" max="100" value={passingThreshold} onChange={(e) => setPassingThreshold(Number(e.target.value))} className="w-16 px-2 py-1 border rounded-lg text-center font-bold" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-3">
        {saved ? (
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 size={14} /> Preferences updated!
          </span>
        ) : <span />}
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
          <Save size={14} /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default MarkSheetSettingsTab;
