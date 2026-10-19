import { Printer, X } from 'lucide-react';
import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

const TimetablePrintModal = ({ isOpen, onClose, slots = [], title = 'Class Timetable', subtitle = '' }) => {
  if (!isOpen) return null;

  const getSlot = (day, p) => slots.find((s) => s.day_of_week === day && Number(s.period_no) === p);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:max-h-none print:rounded-none">
        <div className="p-4 border-b flex items-center justify-between print:hidden">
          <h3 className="font-bold text-gray-800">Print Preview: {title}</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-700">
              <Printer className="w-4 h-4" /> Print Timetable
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto print:p-4 space-y-6 text-gray-900">
          <div className="text-center border-b pb-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-blue-900">Official Institutional Timetable</h2>
            <p className="text-sm font-semibold text-gray-700 mt-1">{title} {subtitle ? `• ${subtitle}` : ''}</p>
            <p className="text-xs text-gray-500">Academic Session 2026 - 2027</p>
          </div>

          <table className="w-full text-xs border border-gray-300 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-2 border border-gray-300 font-bold uppercase w-20 text-left">Day</th>
                {PERIODS.map((p) => (
                  <th key={p} className="p-2 border border-gray-300 font-bold text-center">P{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="border-b border-gray-300">
                  <td className="p-2 border border-gray-300 font-bold bg-gray-50">{day}</td>
                  {PERIODS.map((period) => {
                    const slot = getSlot(day, period);
                    if (!slot) return <td key={period} className="p-2 border border-gray-300 text-center text-gray-400">—</td>;
                    if (slot.is_break) return <td key={period} className="p-2 border border-gray-300 text-center font-bold bg-amber-50 text-amber-800">Break</td>;
                    return (
                      <td key={period} className="p-2 border border-gray-300 text-center">
                        <div className="font-bold text-gray-900">{slot.subject_id?.name}</div>
                        <div className="text-[10px] text-gray-600">{slot.teacher_id?.name}</div>
                        <div className="text-[9px] text-gray-500 font-mono">{slot.room_no} • {slot.start_time}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-6">
            <OfficialSignatureStampBlock
              signatureTitle="Principal / Academic Head"
              stampTitle="Institutional Seal"
              compact={true}
            />
          </div>

          <div className="pt-4 flex items-center justify-between text-[11px] text-gray-400 border-t">
            <span>Generated on {new Date().toLocaleDateString()}</span>
            <span className="font-semibold text-blue-600">Powered by EliteEdu</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetablePrintModal;
