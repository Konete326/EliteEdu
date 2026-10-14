import { Plus, X } from 'lucide-react';

const GradeSectionsInput = ({ sections, onAdd, onRemove, inputVal, setInputVal }) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">Sections *</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          placeholder="Type section (e.g. A, Rose) and enter"
          className="flex-1 px-3 py-1.5 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 text-xs text-ink dark:text-ink-dark outline-none"
        />
        <button type="button" onClick={onAdd} className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-surface-secondary/30 border border-line dark:border-line-dark">
        {sections.map((sec, idx) => (
          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            {sec}
            <button type="button" onClick={() => onRemove(idx)} className="hover:text-bad">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default GradeSectionsInput;
