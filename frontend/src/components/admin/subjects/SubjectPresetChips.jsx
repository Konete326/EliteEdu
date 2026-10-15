import { useState } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import { STANDARD_SUBJECT_PRESETS, CURRICULUM_TIERS } from '../../../utils/curriculumPresets';

const TIERS = ['All', 'Class 1-2', 'Class 3-5', 'Class 6-8', 'Class 9', 'Class 10'];

const SubjectPresetChips = ({ onSelectPreset, currentName }) => {
  const [activeTier, setActiveTier] = useState('All');

  const filteredPresets = STANDARD_SUBJECT_PRESETS.filter((preset) => {
    if (activeTier === 'All') return true;
    const tierSubjects = CURRICULUM_TIERS[activeTier] || [];
    return tierSubjects.some((ts) => ts.toLowerCase() === preset.name.toLowerCase());
  });

  return (
    <div className="space-y-3 p-3.5 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primary-dark">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curriculum Subject Presets</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                activeTier === tier
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface dark:bg-[#1a1a1a] text-ink-muted dark:text-ink-muted-dark hover:text-ink hover:bg-surface-secondary'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filteredPresets.map((preset) => {
          const isSelected = currentName?.trim().toLowerCase() === preset.name.toLowerCase();
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface dark:bg-[#1e1e1e] border border-line dark:border-white/10 text-ink dark:text-ink-dark hover:border-primary/50 hover:text-primary'
              }`}
            >
              {preset.name}
              <span className="ml-1 opacity-60 text-[10px]">({preset.code})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectPresetChips;
