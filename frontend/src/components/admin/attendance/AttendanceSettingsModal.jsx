import React, { useState, useEffect } from 'react';
import { X, Settings, Check, BellRing, Clock, ShieldCheck } from 'lucide-react';

const AttendanceSettingsModal = ({ isOpen, onClose }) => {
  const [entryTime, setEntryTime] = useState('08:00');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [halfDayTime, setHalfDayTime] = useState('11:30');
  const [notifyParentsOnAbsent, setNotifyParentsOnAbsent] = useState(true);
  const [autoMarkDefault, setAutoMarkDefault] = useState('P');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('elite_attendance_settings', JSON.stringify({
      entryTime,
      gracePeriod,
      halfDayTime,
      notifyParentsOnAbsent,
      autoMarkDefault
    }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-3xl p-6 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-line dark:border-line-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink dark:text-ink-dark">Attendance Policy & Timings</h3>
              <p className="text-xs text-ink-muted font-medium">Configure daily operational rules</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>School Start Time</span>
              </label>
              <input
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3 py-2 font-medium text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Late Grace (Mins)</span>
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3 py-2 font-medium text-ink dark:text-ink-dark outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink-sub dark:text-ink-sub-dark mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-600" />
              <span>Half Day Departure Cutoff</span>
            </label>
            <input
              type="time"
              value={halfDayTime}
              onChange={(e) => setHalfDayTime(e.target.value)}
              className="w-full bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 border border-line dark:border-line-dark rounded-xl px-3 py-2 font-medium text-ink dark:text-ink-dark outline-none focus:border-primary"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BellRing className="w-4 h-4 text-primary" />
              <div>
                <p className="font-bold text-ink dark:text-ink-dark">Notify Parents on Absence</p>
                <p className="text-[11px] text-ink-muted">Send automatic SMS/In-App notice</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyParentsOnAbsent}
              onChange={(e) => setNotifyParentsOnAbsent(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-secondary/50 dark:bg-surface-secondary-dark/50 border border-line dark:border-line-dark flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-bold text-ink dark:text-ink-dark">Default Sheet Status</p>
                <p className="text-[11px] text-ink-muted">Pre-populate when sheet loads</p>
              </div>
            </div>
            <select
              value={autoMarkDefault}
              onChange={(e) => setAutoMarkDefault(e.target.value)}
              className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-lg px-2.5 py-1 text-xs font-semibold text-ink dark:text-ink-dark outline-none cursor-pointer"
            >
              <option value="P">Present (P)</option>
              <option value="unmarked">Unmarked</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-bold text-ink-muted hover:bg-surface-secondary dark:hover:bg-surface-secondary-dark transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold bg-primary hover:bg-primary-hover text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{saved ? 'Saved!' : 'Save Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceSettingsModal;
