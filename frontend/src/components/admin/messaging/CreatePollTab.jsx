import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const CreatePollTab = ({ question, setQuestion, options, setOptions }) => {
  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, `Option ${options.length + 1}`]);
    }
  };

  const handleRemoveOption = (idx) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  const handleOptionChange = (idx, val) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-ink dark:text-ink-dark mb-1">
          Poll Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What time works best for tomorrow's meeting?"
          className="w-full bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-3 py-2 text-xs outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-ink dark:text-ink-dark">
            Options (2 - 6)
          </label>
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add option
            </button>
          )}
        </div>
        <div className="max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-surface-secondary dark:bg-surface-secondary-dark border border-line dark:border-line-dark text-ink dark:text-ink-dark rounded-xl px-3 py-1.5 text-xs outline-none"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="p-1.5 text-ink-muted hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePollTab;
