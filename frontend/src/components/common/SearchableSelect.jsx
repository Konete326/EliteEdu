import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

const SearchableSelect = ({
  label, value, onChange, options = [], placeholder = 'Type to search...', emptyOption = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const allOptions = emptyOption ? [emptyOption, ...options] : options;
  const selectedOption = allOptions.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? allOptions.filter((opt) => {
        const q = query.toLowerCase();
        return (opt.label || '').toLowerCase().includes(q) || (opt.sublabel || '').toLowerCase().includes(q);
      })
    : allOptions;

  const handleSelect = (val) => {
    onChange(val);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  return (
    <div ref={containerRef} className="space-y-1 relative">
      {label && <label className="block text-xs font-semibold text-ink dark:text-ink-dark">{label}</label>}

      <div className="relative">
        <input
          type="text"
          value={isOpen ? query : (selectedOption?.label || '')}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
          }}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          className="w-full pl-3 pr-8 py-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/40 dark:bg-white/5 text-xs text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer font-medium"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value ? (
            <button type="button" onClick={handleClear} className="p-0.5 rounded text-ink-muted hover:text-bad transition-colors cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted pointer-events-none" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 max-h-52 overflow-y-auto rounded-xl border border-line dark:border-white/10 bg-surface dark:bg-[#141414] shadow-xl divide-y divide-line/40 dark:divide-white/5 py-1">
          {filtered.length === 0 ? (
            <div className="p-2.5 text-center text-xs text-ink-muted">No results match "{query}"</div>
          ) : (
            filtered.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-primary-soft/50 dark:hover:bg-white/5 text-ink dark:text-ink-dark'
                  }`}
                >
                  <div className="truncate">
                    <span className="block truncate">{opt.label}</span>
                    {opt.sublabel && <span className="text-[10px] text-ink-muted block truncate">{opt.sublabel}</span>}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
