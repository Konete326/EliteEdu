import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, X, Check } from 'lucide-react';
import { formatStandardTime } from '../../utils/timeFormatters';

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const parseInitialTime = (timeStr, defaultFallback = '08:00 AM') => {
  const target = (timeStr && timeStr.trim()) ? timeStr.trim() : defaultFallback;
  const match = target.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3] ? match[3].toUpperCase() : (h >= 12 ? 'PM' : 'AM');
    if (h > 12) h = h % 12;
    if (h === 0) h = 12;
    return {
      hour: String(h).padStart(2, '0'),
      minute: m,
      ampm
    };
  }
  return { hour: '08', minute: '00', ampm: 'AM' };
};

const TimePickerPopover = ({
  anchorRect,
  value,
  onChange,
  onClose,
  defaultPlaceholder = '08:00 AM',
  presetStart = '08:00 AM',
  presetEnd = '02:00 PM'
}) => {
  const popoverRef = useRef(null);
  const initial = parseInitialTime(value, defaultPlaceholder);
  const [selectedHour, setSelectedHour] = useState(initial.hour);
  const [selectedMinute, setSelectedMinute] = useState(initial.minute);
  const [selectedAmPm, setSelectedAmPm] = useState(initial.ampm);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!anchorRect) return null;

  const popoverWidth = 280;
  const popoverHeight = 330;
  let top = anchorRect.bottom + 6;
  if (top + popoverHeight > window.innerHeight) {
    top = Math.max(10, anchorRect.top - popoverHeight - 6);
  }
  let left = Math.max(10, Math.min(anchorRect.left, window.innerWidth - popoverWidth - 10));

  const applyTime = (h, m, ap) => {
    const formatted = `${h}:${m} ${ap}`;
    onChange(formatted);
    onClose();
  };

  const handleConfirm = () => {
    applyTime(selectedHour, selectedMinute, selectedAmPm);
  };

  const handleClear = () => {
    onChange('');
    onClose();
  };

  const handleSetNow = () => {
    const nowStr = formatStandardTime(new Date());
    onChange(nowStr);
    onClose();
  };

  return createPortal(
    <div
      ref={popoverRef}
      style={{ top: `${top}px`, left: `${left}px`, width: `${popoverWidth}px` }}
      className="fixed z-50 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-2xl p-3.5 space-y-3 animate-in fade-in zoom-in-95 duration-150 select-none text-xs"
    >
      <div className="flex items-center justify-between pb-2 border-b border-line dark:border-line-dark">
        <div className="flex items-center gap-2 text-ink dark:text-ink-dark font-bold">
          <Clock className="w-4 h-4 text-primary" />
          <span>Select Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
            {selectedHour}:{selectedMinute} {selectedAmPm}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {presetStart && (
          <button
            type="button"
            onClick={() => {
              const p = parseInitialTime(presetStart);
              applyTime(p.hour, p.minute, p.ampm);
            }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-surface-secondary dark:bg-surface-secondary-dark hover:border-primary border border-line dark:border-line-dark text-ink dark:text-ink-dark transition-all cursor-pointer"
          >
            Start ({presetStart})
          </button>
        )}
        {presetEnd && (
          <button
            type="button"
            onClick={() => {
              const p = parseInitialTime(presetEnd);
              applyTime(p.hour, p.minute, p.ampm);
            }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-surface-secondary dark:bg-surface-secondary-dark hover:border-primary border border-line dark:border-line-dark text-ink dark:text-ink-dark transition-all cursor-pointer"
          >
            End ({presetEnd})
          </button>
        )}
        <button
          type="button"
          onClick={handleSetNow}
          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all cursor-pointer"
        >
          Now
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block mb-1">
            Hour
          </span>
          <div className="grid grid-cols-6 gap-1">
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setSelectedHour(h)}
                className={`py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                  selectedHour === h
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 hover:bg-surface-secondary text-ink dark:text-ink-dark'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted tracking-wider block mb-1">
            Minute
          </span>
          <div className="grid grid-cols-6 gap-1">
            {MINUTES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMinute(m)}
                className={`py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer text-center ${
                  selectedMinute === m
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 hover:bg-surface-secondary text-ink dark:text-ink-dark'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 p-1 rounded-xl border border-line dark:border-line-dark">
            <button
              type="button"
              onClick={() => setSelectedAmPm('AM')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedAmPm === 'AM'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setSelectedAmPm('PM')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedAmPm === 'PM'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              PM
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClear}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-ink-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Set</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TimePickerPopover;
