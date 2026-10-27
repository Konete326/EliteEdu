import { useState } from 'react';
import { Printer, X, Calendar, Layout, CheckCircle2 } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const MONTHS_LIST = [
  'January 2026', 'February 2026', 'March 2026', 'April 2026',
  'May 2026', 'June 2026', 'July 2026', 'August 2026',
  'September 2026', 'October 2026', 'November 2026', 'December 2026'
];

const TimetablePrintModal = ({ isOpen, onClose, slots = [], title = 'Class Timetable', subtitle = '' }) => {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const [selectedMonth, setSelectedMonth] = useState(MONTHS_LIST.includes(currentMonth) ? currentMonth : 'October 2026');
  const [orientation, setOrientation] = useState('landscape');

  if (!isOpen) return null;

  const getSlot = (day, p) => slots.find((s) => s.day_of_week === day && (Number(s.period_no) === p || Number(s.slot_no) === p));

  const getPeriodTiming = (p) => {
    const found = slots.find((s) => (Number(s.period_no) === p || Number(s.slot_no) === p) && s.start_time);
    return found ? `${found.start_time} – ${found.end_time}` : '';
  };

  const teachingCount = slots.filter((s) => !s.is_break && !s.is_assembly && (s.subject_id || s.grade_id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 print:p-0 print:bg-white print:fixed print:inset-0">
      <style>{`
        @page {
          size: ${orientation === 'landscape' ? 'A4 landscape' : 'A4 portrait'};
          margin: 6mm;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          .print-a4-sheet {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 4mm !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
      `}</style>

      <div className={`bg-white rounded-3xl w-full ${orientation === 'landscape' ? 'max-w-6xl' : 'max-w-4xl'} max-h-[96vh] flex flex-col shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:max-h-none print:rounded-none`}>
        <div className="p-3.5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 bg-gray-50/80 no-print">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-gray-800">Monthly Routine A4 Print Preview</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2.5 py-1">
              <span className="text-[11px] font-bold text-gray-500 uppercase">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
              >
                {MONTHS_LIST.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setOrientation('landscape')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  orientation === 'landscape'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Landscape (A4)
              </button>
              <button
                type="button"
                onClick={() => setOrientation('portrait')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  orientation === 'portrait'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Portrait
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Single A4
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 print:p-2 overflow-y-auto print-a4-sheet space-y-3.5 text-gray-900 bg-white">
          <div className="flex items-center justify-between border-b-2 border-gray-900 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary text-white text-[9px] font-black uppercase tracking-wider">
                  Academic Schedule
                </span>
                <span className="text-[11px] font-bold text-gray-600">Elite Educational System</span>
              </div>
              <h2 className="text-lg font-black text-gray-950 uppercase tracking-tight mt-0.5">
                Monthly Institutional Timetable & Duty Roster
              </h2>
              <p className="text-xs font-bold text-primary">
                {title} {subtitle ? `• ${subtitle}` : ''}
              </p>
            </div>

            <div className="text-right space-y-0.5">
              <div className="inline-block px-3 py-1 rounded-lg bg-gray-100 border border-gray-300 text-xs font-black text-gray-900">
                Month: {selectedMonth}
              </div>
              <div className="text-[10px] text-gray-500 font-semibold">
                Session: 2026 – 2027 • Weekly Active Slots: {teachingCount}
              </div>
              <div className="text-[9px] text-gray-400">
                Issued for Official Academic Implementation
              </div>
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-gray-100/90 text-gray-800 border-b border-gray-300">
                  <th className="p-2 border-r border-gray-300 font-bold uppercase text-[11px] w-24 text-center bg-gray-200/60">
                    Day / Slot
                  </th>
                  {PERIODS.map((p) => {
                    const timing = getPeriodTiming(p);
                    return (
                      <th key={p} className="p-1.5 border-r border-gray-300 last:border-r-0 font-bold text-center">
                        <div className="text-[11px] font-black text-gray-900">Period {p}</div>
                        {timing && (
                          <div className="text-[9px] font-mono text-gray-500 font-medium">{timing}</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day, idx) => (
                  <tr key={day} className={`border-b border-gray-300 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="p-2 border-r border-gray-300 font-bold text-xs bg-gray-100/70 text-gray-900 text-center">
                      {day}
                    </td>
                    {PERIODS.map((period) => {
                      const slot = getSlot(day, period);
                      if (!slot) {
                        return (
                          <td key={period} className="p-1.5 border-r border-gray-300 last:border-r-0 text-center text-gray-300 text-xs">
                            —
                          </td>
                        );
                      }
                      if (slot.is_break) {
                        return (
                          <td key={period} className="p-1.5 border-r border-gray-300 last:border-r-0 text-center bg-amber-50/80">
                            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                              Recess Break
                            </span>
                          </td>
                        );
                      }
                      if (slot.is_assembly) {
                        return (
                          <td key={period} className="p-1.5 border-r border-gray-300 last:border-r-0 text-center bg-primary/5">
                            <span className="text-[10px] font-black text-primary uppercase tracking-wider block">
                              Assembly
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td key={period} className="p-1.5 border-r border-gray-300 last:border-r-0 align-top">
                          <div className="space-y-0.5">
                            <div className="font-bold text-[11px] text-gray-900 truncate leading-tight">
                              {slot.subject_id?.name || 'Subject'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-600 font-medium">
                              <span>{slot.grade_id?.name || 'Class'}</span>
                              {slot.section && <span className="font-bold">({slot.section})</span>}
                            </div>
                            <div className="text-[9px] text-gray-500 font-mono flex items-center justify-between pt-0.5">
                              <span>{slot.room_no || 'Rm 101'}</span>
                              <span className="text-[8px] text-gray-400 font-sans">{slot.teacher_id?.name?.split(' ')[0]}</span>
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-end justify-between pt-2 border-t border-gray-200">
            <div className="space-y-1 text-[10px] text-gray-500 max-w-sm">
              <div className="flex items-center gap-1.5 font-bold text-gray-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Verified Monthly Teaching Duty Schedule
              </div>
              <p>Faculty members are required to strictly observe assigned period timings. Any substitutions must be authorized by the Academic Directorate.</p>
            </div>

            <div className="w-64">
              <OfficialSignatureStampBlock
                signatureTitle="Academic Incharge / Principal"
                stampTitle="Institutional Stamp"
                compact={true}
              />
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[9px] text-gray-400 border-t border-gray-100">
            <span>Generated on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • Session 2026-2027</span>
            <span className="font-semibold text-gray-500">EliteEdu • Academic Operations System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePrintModal;
