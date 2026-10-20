import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GraduationCap, ChevronDown, Check, X, Search } from 'lucide-react';

const ClassSearchableSelect = ({
  grades = [],
  selectedGradeId = '',
  onGradeChange,
  disabled = false,
  placeholder = 'Type class name or select...',
  allowAll = false,
  allLabel = 'All Classes'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selectedGrade = useMemo(() => {
    if (!selectedGradeId) return null;
    return grades.find((g) => String(g._id) === String(selectedGradeId)) || null;
  }, [grades, selectedGradeId]);

  useEffect(() => {
    if (!isOpen) {
      if (selectedGrade) {
        setInputText(selectedGrade.name || '');
      } else if (allowAll && selectedGradeId === 'all') {
        setInputText(allLabel);
      } else {
        setInputText('');
      }
    }
  }, [selectedGradeId, selectedGrade, isOpen, allowAll, allLabel]);

  const filteredGrades = useMemo(() => {
    const q = inputText.trim().toLowerCase();
    if (!q) return grades;
    return grades.filter((g) => {
      const name = (g.name || '').toLowerCase();
      const level = g.grade_level ? String(g.grade_level).toLowerCase() : '';
      return name.includes(q) || level.includes(q);
    });
  }, [grades, inputText]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        const q = inputText.trim().toLowerCase();
        if (q) {
          const exact = grades.find((g) => (g.name || '').trim().toLowerCase() === q);
          if (exact) {
            onGradeChange(exact._id);
            setInputText(exact.name || '');
            return;
          }
        }
        if (selectedGrade) {
          setInputText(selectedGrade.name || '');
        } else if (allowAll && selectedGradeId === 'all') {
          setInputText(allLabel);
        } else {
          setInputText('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputText, grades, selectedGrade, selectedGradeId, onGradeChange, allowAll, allLabel]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredGrades.length]);

  useEffect(() => {
    if (isOpen && listRef.current && listRef.current.children[highlightedIndex]) {
      listRef.current.children[highlightedIndex].scrollIntoView({
        block: 'nearest'
      });
    }
  }, [highlightedIndex, isOpen]);

  const handleSelectGrade = (grade) => {
    if (!grade) {
      onGradeChange(allowAll ? 'all' : '');
      setInputText(allowAll ? allLabel : '');
    } else {
      onGradeChange(grade._id);
      setInputText(grade.name || '');
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onGradeChange('');
    setInputText('');
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const maxIndex = allowAll ? filteredGrades.length : filteredGrades.length - 1;
      setHighlightedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const maxIndex = allowAll ? filteredGrades.length : filteredGrades.length - 1;
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen) {
        if (allowAll && highlightedIndex === 0 && !inputText.trim()) {
          handleSelectGrade(null);
        } else {
          const targetGrade = allowAll && !inputText.trim()
            ? filteredGrades[highlightedIndex - 1]
            : filteredGrades[highlightedIndex];
          if (targetGrade) {
            handleSelectGrade(targetGrade);
          } else if (filteredGrades.length === 1) {
            handleSelectGrade(filteredGrades[0]);
          }
        }
      } else {
        setIsOpen(true);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setInputText(selectedGrade ? selectedGrade.name || '' : '');
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted">
          {isOpen ? <Search className="w-3.5 h-3.5 text-primary" /> : <GraduationCap className="w-3.5 h-3.5" />}
        </div>

        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputText}
          placeholder={placeholder}
          onFocus={() => {
            setIsOpen(true);
            inputRef.current?.select();
          }}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full pl-[38px] pr-8 py-2 rounded-xl text-xs font-medium bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark text-ink dark:text-ink-dark outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {(selectedGradeId || inputText) && !disabled ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-ink-muted hover:text-bad hover:bg-surface-secondary dark:hover:bg-white/5 transition-colors cursor-pointer"
              title="Clear class"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
              }}
              className="p-1 text-ink-muted cursor-pointer"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xl overflow-hidden py-1">
          <div ref={listRef} className="max-h-60 overflow-y-auto divide-y divide-line/30 dark:divide-line-dark/30">
            {allowAll && !inputText.trim() && (
              <button
                type="button"
                onClick={() => handleSelectGrade(null)}
                className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                  selectedGradeId === 'all' || !selectedGradeId
                    ? 'bg-primary/10 text-primary font-bold'
                    : highlightedIndex === 0
                    ? 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark'
                    : 'hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                  <span className="font-semibold">{allLabel}</span>
                </div>
                {(selectedGradeId === 'all' || !selectedGradeId) && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            )}

            {filteredGrades.length === 0 ? (
              <div className="px-4 py-5 text-center">
                <p className="text-xs font-semibold text-ink dark:text-ink-dark">No matching class</p>
                <p className="text-[11px] text-ink-muted mt-0.5">No classes found matching &quot;{inputText}&quot;</p>
              </div>
            ) : (
              filteredGrades.map((grade, idx) => {
                const isSelected = String(grade._id) === String(selectedGradeId);
                const actualIndex = allowAll && !inputText.trim() ? idx + 1 : idx;
                const isHighlighted = highlightedIndex === actualIndex;
                const sectionCount = Array.isArray(grade.sections) ? grade.sections.length : 0;

                return (
                  <button
                    key={grade._id}
                    type="button"
                    onClick={() => handleSelectGrade(grade)}
                    onMouseEnter={() => setHighlightedIndex(actualIndex)}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-primary/10 text-primary font-bold'
                        : isHighlighted
                        ? 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink dark:text-ink-dark'
                        : 'hover:bg-surface-secondary dark:hover:bg-white/5 text-ink dark:text-ink-dark'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${isSelected ? 'bg-primary text-white' : 'bg-surface-secondary dark:bg-surface-secondary-dark text-ink-muted'}`}>
                        <GraduationCap className="w-3 h-3" />
                      </div>
                      <div className="truncate">
                        <span className="block truncate font-semibold">{grade.name}</span>
                        {sectionCount > 0 && (
                          <span className="text-[10px] text-ink-muted block">
                            {sectionCount} {sectionCount === 1 ? 'Section' : 'Sections'}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSearchableSelect;
