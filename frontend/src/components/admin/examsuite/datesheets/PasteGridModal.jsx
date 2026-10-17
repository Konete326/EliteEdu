import React, { useState } from 'react';
import { X, Table } from 'lucide-react';

const PasteGridModal = ({ isOpen, onClose, onApplyRows }) => {
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const handleParseAndApply = () => {
    if (!rawText.trim()) return;
    const lines = rawText.trim().split('\n');
    const parsed = lines.map(line => {
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const dateVal = parts[0]?.trim() || '';
      let dayName = '';
      if (dateVal) {
        const d = new Date(dateVal);
        if (!isNaN(d.getTime())) dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      }
      return {
        exam_date: dateVal,
        day_name: dayName || parts[1]?.trim() || 'Monday',
        subject_name: parts[2]?.trim() || parts[0]?.trim() || '',
        start_time: parts[5]?.trim() || '09:00 AM',
        end_time: parts[6]?.trim() || '12:00 PM',
        total_marks: Number(parts[7]?.trim()) || 100,
        syllabus: parts[8]?.trim() || 'All Syllabus'
      };
    });
    onApplyRows(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-slate-800 dark:text-white">Paste Grid from Excel / Sheet</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-500">Copy rows directly from Excel or Google Sheets and paste below. Tab or comma separated columns will be automatically mapped into your schedule.</p>
          <textarea
            rows={7}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="2026-11-02	Monday	English	...	09:00 AM	12:00 PM	100	Chapters 1-3"
            className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300">Cancel</button>
            <button type="button" onClick={handleParseAndApply} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-primary text-white hover:bg-primary-hover">
              <Table size={14} /> Parse & Apply Rows
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasteGridModal;
