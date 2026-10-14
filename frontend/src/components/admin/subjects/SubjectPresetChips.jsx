import { Sparkles } from 'lucide-react';

const PRESETS = [
  { name: 'Mathematics', code: 'MATH', mandatory: true },
  { name: 'Physics', code: 'PHY', mandatory: true },
  { name: 'Chemistry', code: 'CHEM', mandatory: true },
  { name: 'Biology', code: 'BIO', mandatory: true },
  { name: 'Computer Science', code: 'CS', mandatory: true },
  { name: 'English', code: 'ENG', mandatory: true },
  { name: 'Urdu', code: 'URDU', mandatory: true },
  { name: 'Islamiyat', code: 'ISL', mandatory: true },
  { name: 'Arabic', code: 'ARB', mandatory: false },
  { name: 'Science', code: 'SCI', mandatory: true }
];

const SubjectPresetChips = ({ onSelectPreset, currentName }) => {
  return (
    <div className="space-y-2 p-3 rounded-xl bg-surface-secondary/70 dark:bg-[#141414] border border-line dark:border-white/10">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-primary dark:text-primary-dark">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Quick Pick Standard Subjects</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => {
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectPresetChips;
