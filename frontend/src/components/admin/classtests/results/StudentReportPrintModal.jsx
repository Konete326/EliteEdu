import React from 'react';
import { X, Printer } from 'lucide-react';

export default function StudentReportPrintModal({ isOpen, onClose, reportData, signature, stamp }) {
  if (!isOpen || !reportData) return null;
  const { student, tests = [], avgPct = 0, overallGrade = 'F' } = reportData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-muted/20 print:hidden">
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Student Test Performance Report Card</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-primary text-white shadow-2xs">
              <Printer className="w-3.5 h-3.5" /> Print Card
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-muted/10 print:p-0 print:bg-white">
          <div className="max-w-[700px] mx-auto bg-white text-black p-6 rounded-xl border border-line print:border-0 print:m-0 text-xs font-sans space-y-4">
            <div className="text-center pb-3 border-b-2 border-black space-y-1">
              <h2 className="text-base font-black uppercase tracking-wide">ELITE EDUCATIONAL SYSTEM</h2>
              <h3 className="text-sm font-bold text-gray-800">PERIODIC CLASS TEST REPORT CARD</h3>
              <p className="text-[11px] text-gray-600">Official Student Assessment Record</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-300">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Student Name</span>
                <span className="text-sm font-bold block">{student?.name}</span>
                <span className="text-[11px] text-gray-600">Father: {student?.father_name || '-'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500 uppercase block font-bold">Registration</span>
                <span className="text-xs font-bold block">GR: {student?.gr_number} • Roll: {student?.roll_number || '-'}</span>
                <span className="text-xs font-bold text-primary block mt-0.5">Aggregate: {avgPct}% ({overallGrade})</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse border border-black text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-black font-bold">
                  <th className="border border-black p-1.5">Date</th>
                  <th className="border border-black p-1.5">Subject</th>
                  <th className="border border-black p-1.5">Test Title</th>
                  <th className="border border-black p-1.5 text-center">Marks</th>
                  <th className="border border-black p-1.5 text-center">%</th>
                  <th className="border border-black p-1.5 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t, idx) => (
                  <tr key={idx} className="border-b border-black">
                    <td className="border border-black p-1.5">{new Date(t.test_date).toLocaleDateString()}</td>
                    <td className="border border-black p-1.5 font-bold">{t.subject_name}</td>
                    <td className="border border-black p-1.5">{t.title}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{t.pass_status === 'ABSENT' ? 'ABS' : `${t.obtained_marks} / ${t.total_marks}`}</td>
                    <td className="border border-black p-1.5 text-center font-bold">{t.pass_status === 'ABSENT' ? '0%' : `${t.percentage}%`}</td>
                    <td className="border border-black p-1.5 text-center font-black">{t.grade_letter}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-6 flex items-end justify-between px-4">
              <div className="text-center">
                <div className="h-10 border-b border-black w-24 mx-auto"></div>
                <span className="text-[10px] font-bold block mt-1">Class Teacher</span>
              </div>
              <div className="text-center">
                {stamp?.file_url ? <img src={stamp.file_url} alt="Stamp" className="h-12 w-12 mx-auto object-contain" /> : <div className="h-12 w-12 border border-dashed border-gray-400 rounded-full flex items-center justify-center text-[8px] text-gray-500 font-bold mx-auto">STAMP</div>}
                <span className="text-[10px] font-bold block mt-1">Official Seal</span>
              </div>
              <div className="text-center">
                {signature?.file_url ? <img src={signature.file_url} alt="Signature" className="h-10 max-w-[90px] mx-auto object-contain" /> : <div className="h-10 border-b border-black w-24 mx-auto"></div>}
                <span className="text-[10px] font-bold block mt-1">Principal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
