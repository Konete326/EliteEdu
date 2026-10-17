import React, { useState } from 'react';
import { X, Printer, Users } from 'lucide-react';
import axios from '../../api/axios';

const SeatingPlanModal = ({ isOpen, onClose, examId }) => {
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState(null);

  const generatePlan = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/exam-suite/datesheets/seating-arrangement', { exam_id: examId });
      setPlanData(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) generatePlan();
  }, [isOpen, examId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users size={18} className="text-primary" /> Examination Seating Arrangement
            </h3>
            <p className="text-xs text-slate-400">Allocated seats across examination halls and rooms</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover">
              <Printer size={14} /> Print Seating Plan
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400">Generating seating plan allocations...</div>
          ) : !planData?.rooms ? (
            <div className="text-center text-xs text-slate-400">No student allocations found.</div>
          ) : (
            planData.rooms.map((room, rIdx) => (
              <div key={rIdx} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
                  <span className="font-bold text-xs text-slate-800 dark:text-white">{room.room_name}</span>
                  <span className="text-xs text-slate-500 font-semibold">{room.total_allocated} Students Allocated</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {room.seats.map((seat, sIdx) => (
                    <div key={sIdx} className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-[11px] shadow-2xs">
                      <div className="flex justify-between font-bold text-primary mb-0.5">
                        <span>{seat.seat_no}</span>
                        <span className="text-slate-400 font-normal">{seat.class_name}-{seat.section}</span>
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 truncate">{seat.name}</div>
                      <div className="text-[10px] text-slate-400">Roll: {seat.roll_number}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatingPlanModal;
