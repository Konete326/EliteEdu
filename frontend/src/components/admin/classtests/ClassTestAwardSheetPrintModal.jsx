import React from 'react';
import { X, Printer } from 'lucide-react';

export default function ClassTestAwardSheetPrintModal({ isOpen, onClose, test, rows = [], signature, stamp }) {
  if (!isOpen || !test) return null;
  const totalMax = test.total_marks || 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-muted/20 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Class Test Award List</h3>
              <p className="text-xs text-text-muted">{test.title} • {test.grade_id?.name || 'Class'} ({test.section})</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-white shadow-2xs">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/10 print:p-0 print:bg-white">
          <div className="max-w-[760px] mx-auto bg-white text-black p-6 rounded-xl border border-line print:border-0 print:m-0 text-xs font-sans">
            <div className="text-center pb-3 border-b-2 border-black space-y-1">
              <h2 className="text-base font-black uppercase tracking-wide">{test.campus_id?.name || 'INSTITUTIONAL ACADEMIC BOARD'}</h2>
              <h3 className="text-sm font-bold text-gray-800">CLASS TEST MARKS AWARD SHEET</h3>
              <p className="text-[11px] text-gray-600">Test: {test.title} • Class: {test.grade_id?.name || 'Class'} ({test.section}) • Subject: {test.subject_id?.name || 'Subject'}</p>
              <p className="text-[11px] font-semibold text-gray-700">Date: {test.test_date ? new Date(test.test_date).toLocaleDateString() : '-'} | Total Marks: {totalMax} | Passing Marks: {test.passing_marks}</p>
            </div>

            <div className="mt-4">
              <table className="w-full text-left border-collapse border border-black text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-black font-bold">
                    <th className="border border-black p-1.5 text-center">Roll</th>
                    <th className="border border-black p-1.5">Student Name</th>
                    <th className="border border-black p-1.5">Father Name</th>
                    <th className="border border-black p-1.5 text-center">Marks ({totalMax})</th>
                    <th className="border border-black p-1.5 text-center">%</th>
                    <th className="border border-black p-1.5 text-center">Grade</th>
                    <th className="border border-black p-1.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx} className="border-b border-black">
                      <td className="border border-black p-1.5 text-center font-bold">{r.roll_number || '-'}</td>
                      <td className="border border-black p-1.5 font-bold">{r.name}</td>
                      <td className="border border-black p-1.5">{r.father_name || '-'}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{r.is_absent ? 'ABS' : r.obtained_marks}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{r.is_absent ? '0%' : `${r.percentage}%`}</td>
                      <td className="border border-black p-1.5 text-center font-black">{r.grade_letter}</td>
                      <td className="border border-black p-1.5 text-center font-bold">{r.pass_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-4 flex items-end justify-between px-4">
              <div className="text-center">
                <div className="h-10 border-b border-black w-28 mx-auto"></div>
                <span className="text-[10px] font-bold block mt-1 text-gray-800">Subject Teacher</span>
              </div>
              <div className="text-center">
                {stamp?.file_url ? <img src={stamp.file_url} alt="Stamp" className="h-14 w-14 mx-auto object-contain" /> : <div className="h-14 w-14 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[9px] text-gray-500 font-bold mx-auto">STAMP</div>}
                <span className="text-[10px] font-bold block mt-1 text-gray-700">Official Stamp</span>
              </div>
              <div className="text-center">
                {signature?.file_url ? <img src={signature.file_url} alt="Signature" className="h-10 max-w-[100px] mx-auto object-contain" /> : <div className="h-10 border-b border-black w-28 mx-auto"></div>}
                <span className="text-[10px] font-bold block mt-1 text-gray-800">Principal / Incharge</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
