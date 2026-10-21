import { useState, useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X, Check } from 'lucide-react';

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Type to search...',
  icon: LeadingIcon,
  allowClear = false,
  disabled = false,
  searchable = true,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0, maxHeight: 220, openUpwards: false });
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value ?? opt._id,
          label: opt.label ?? opt.name ?? String(opt.value ?? opt._id),
          subtext: opt.subtext ?? opt.designation ?? opt.email ?? '',
          badge: opt.badge ?? '',
          icon: opt.icon
        };
      }
      return {
        value: opt,
        label: String(opt),
        subtext: '',
        badge: '',
        icon: null
      };
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => String(opt.value) === String(value));
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return normalizedOptions;
    const q = query.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      const matchLabel = opt.label.toLowerCase().includes(q);
      const matchSub = opt.subtext ? opt.subtext.toLowerCase().includes(q) : false;
      const matchBadge = opt.badge ? opt.badge.toLowerCase().includes(q) : false;
      return matchLabel || matchSub || matchBadge;
    });
  }, [normalizedOptions, query]);

  const updatePosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpwards = spaceBelow < 220 && spaceAbove > spaceBelow;

    setMenuPos({
      left: Math.max(8, rect.left),
      width: Math.min(rect.width, window.innerWidth - 16),
      openUpwards,
      bottom: window.innerHeight - rect.top + 4,
      top: rect.bottom + 4,
      maxHeight: Math.min(220, Math.max(120, openUpwards ? spaceAbove - 16 : spaceBelow - 16))
    });
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setIsOpen(false);
      } else {
        updatePosition();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);
    setTimeout(() => inputRef.current?.focus(), 40);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
    setQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  };

  const sizeClasses = size === 'sm'
    ? 'px-2.5 py-1.5 text-xs'
    : 'px-3.5 py-2 text-xs sm:text-sm';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border border-line dark:border-line-dark bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-ink dark:text-white transition-all outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${
          isOpen ? 'border-primary ring-2 ring-primary/10 shadow-xs' : 'hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
          {LeadingIcon && (
            <LeadingIcon size={14} className="shrink-0 text-primary dark:text-primary-dark" />
          )}
          {selectedOption ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold truncate text-ink dark:text-white">
                {selectedOption.label}
              </span>
              {selectedOption.subtext && (
                <span className="text-[10px] text-ink-muted truncate hidden sm:inline">
                  ({selectedOption.subtext})
                </span>
              )}
              {selectedOption.badge && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-ink-muted truncate font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-1">
          {allowClear && selectedOption && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-0.5 rounded-md hover:bg-surface-secondary text-ink-muted hover:text-bad transition-colors cursor-pointer"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-ink-muted transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-primary' : ''
            }`}
          />
        </div>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: `${menuPos.left}px`,
            width: `${menuPos.width}px`,
            ...(menuPos.openUpwards
              ? { bottom: `${menuPos.bottom}px` }
              : { top: `${menuPos.top}px` }),
            maxHeight: `${menuPos.maxHeight}px`,
            zIndex: 99999
          }}
          className="rounded-2xl bg-surface dark:bg-[#141414] border border-line dark:border-white/10 shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-100 flex flex-col min-w-[200px]"
        >
          {searchable && (
            <div className="relative mb-1 p-1 shrink-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-line dark:border-white/10 bg-surface-secondary/50 dark:bg-[#1f1f1f] text-xs text-ink dark:text-white outline-none focus:border-primary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink cursor-pointer"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          )}

          <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 scrollbar-thin">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs text-ink-muted">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const ItemIcon = opt.icon;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold dark:bg-primary/20'
                        : 'text-ink dark:text-white hover:bg-surface-secondary dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {ItemIcon && <ItemIcon size={13} className="shrink-0 text-primary" />}
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{opt.label}</p>
                        {opt.subtext && (
                          <p className="text-[10px] text-ink-muted truncate">{opt.subtext}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={13} className="text-primary" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SearchableSelect;