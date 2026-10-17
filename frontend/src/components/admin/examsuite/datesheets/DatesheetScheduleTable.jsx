import React from 'react';
import { Upload, Table, Plus, Trash2 } from 'lucide-react';
import OfficialSignatureStampBlock from '../../../common/OfficialSignatureStampBlock';

const DatesheetScheduleTable = ({ papers, subjects, teachers, onAddRow, onUpdateRow, onRemoveRow, onOpenPDFModal, onOpenPasteModal }) => {
  const handleDateChange = (idx, dateVal) => {
    let day = '';
    if (dateVal) {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) day = d.toLocaleDateString('en-US', { weekday: 'long' });
    }
    onUpdateRow(idx, { exam_date: dateVal, day_name: day });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <span>Exam Schedule</span>
          <span className="text-xs font-normal text-slate-400">({papers.length} {papers.length === 1 ? 'entry' : 'entries'})</span>
        </h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenPDFModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Upload size={14} /> Upload PDF
          </button>
          <button type="button" onClick={onOpenPasteModal} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Table size={14} /> Paste Grid
          </button>
          <button type="button" onClick={onAddRow} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-xs">
            <Plus size={14} /> Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[950px]">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Day</th>
              <th className="p-2.5">Subject</th>
              <th className="p-2.5">Teacher</th>
              <th className="p-2.5">Invigilator</th>
              <th className="p-2.5">Start</th>
              <th className="p-2.5">End</th>
              <th className="p-2.5">Marks</th>
              <th className="p-2.5">Syllabus</th>
              <th className="p-2.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {papers.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="p-2">
                  <input type="date" value={row.exam_date || ''} onChange={(e) => handleDateChange(idx, e.target.value)} className="w-32 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </td>
                <td className="p-2">
                  <span className="text-slate-600 dark:text-slate-300 font-medium px-2">{row.day_name || '—'}</span>
                </td>
                <td className="p-2">
                  <select value={row.subject_id || ''} onChange={(e) => onUpdateRow(idx, { subject_id: e.target.value, subject_name: subjects.find(s => s._id === e.target.value)?.name || '' })} className="w-36 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <select value={row.examiner_id || ''} onChange={(e) => onUpdateRow(idx, { examiner_id: e.target.value, examiner_name: teachers.find(t => t._id === e.target.value)?.name || '' })} className="w-32 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option value="">Select teacher</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <select value={row.invigilator_id || ''} onChange={(e) => onUpdateRow(idx, { invigilator_id: e.target.value, invigilator_name: teachers.find(t => t._id === e.target.value)?.name || '' })} className="w-32 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option value="">Select invigilator</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <input type="text" value={row.start_time || '09:00 AM'} onChange={(e) => onUpdateRow(idx, { start_time: e.target.value })} className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center" />
                </td>
                <td className="p-2">
                  <input type="text" value={row.end_time || '12:00 PM'} onChange={(e) => onUpdateRow(idx, { end_time: e.target.value })} className="w-24 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center" />
                </td>
                <td className="p-2">
                  <input type="number" value={row.total_marks ?? 100} onChange={(e) => onUpdateRow(idx, { total_marks: Number(e.target.value) })} className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center" />
                </td>
                <td className="p-2">
                  <input type="text" value={row.syllabus || ''} onChange={(e) => onUpdateRow(idx, { syllabus: e.target.value })} placeholder="e.g. Chapters 1-5" className="w-36 px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </td>
                <td className="p-2 text-center">
                  <button type="button" onClick={() => onRemoveRow(idx)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <OfficialSignatureStampBlock
          signatureTitle="Examination Incharge"
          stampTitle="Head of Institution Seal"
        />
      </div>
    </div>
  );
};

export default DatesheetScheduleTable;
