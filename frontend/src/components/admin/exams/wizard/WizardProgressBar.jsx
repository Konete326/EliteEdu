import { Check } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Exam Info', desc: 'Term & Dates' },
  { step: 2, title: 'Classes', desc: 'Target Groups' },
  { step: 3, title: 'Papers', desc: 'Marks & Examiners' },
  { step: 4, title: 'Review', desc: 'Preview & Save' }
];

const WizardProgressBar = ({ currentStep, onSelectStep }) => {
  return (
    <div className="bg-surface dark:bg-[#0c0c0c] border border-line dark:border-white/10 rounded-2xl p-4 shadow-xs">
      <div className="grid grid-cols-4 gap-2">
        {STEPS.map((s) => {
          const isComplete = currentStep > s.step;
          const isActive = currentStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => onSelectStep(s.step)}
              className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : isComplete
                  ? 'bg-surface-secondary/50 dark:bg-white/5 text-ink dark:text-ink-dark'
                  : 'text-ink-muted opacity-60'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                isComplete
                  ? 'bg-emerald-500 text-white'
                  : isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary dark:bg-white/10 text-ink-muted'
              }`}>
                {isComplete ? <Check className="w-3.5 h-3.5" /> : s.step}
              </div>
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-bold truncate">{s.title}</p>
                <p className="text-[10px] text-ink-muted truncate">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgressBar;
