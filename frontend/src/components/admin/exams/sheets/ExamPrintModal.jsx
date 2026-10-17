import React, { useState, useEffect } from 'react';
import { X, Printer, Calendar, Award, FileSpreadsheet } from 'lucide-react';
import axios from '../../../../utils/axiosConfig';
import ExamDatesheetPrintView from './ExamDatesheetPrintView';
import ExamAwardListPrintView from './ExamAwardListPrintView';
import ExamGazettePrintView from './ExamGazettePrintView';

export default function ExamPrintModal({ isOpen, onClose, exam }) {
  if (!isOpen || !exam) return null;
  const [activeTab, setActiveTab] = useState('datesheet');
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(0);
  const [data, setData] = useState({ exam: null, marks: [], signature: null, stamp: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get(`/exams/${exam._id}/print-data`)
      .then((res) => { if (res.data?.success) setData(res.data); })
      .finally(() => setIsLoading(false));
  }, [exam._id]);

  const currentExam = data.exam || exam;
  const papers = currentExam.papers || [];
  const activePaper = papers[selectedPaperIdx] || papers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between bg-muted/20 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Printable Examination Studio</h3>
              <p className="text-xs text-text-muted dark:text-text-muted-dark">{currentExam.title} ({currentExam.term_type})</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg border border-line dark:border-line-dark hover:bg-hover text-text-muted"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-3 border-b border-line dark:border-line-dark flex items-center justify-between gap-3 flex-wrap print:hidden">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setActiveTab('datesheet')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'datesheet' ? 'bg-primary text-white' : 'border border-line dark:border-line-dark text-text-muted hover:text-text-primary'}`}>
              <Calendar className="w-3.5 h-3.5" /> Datesheet
            </button>
            <button type="button" onClick={() => setActiveTab('award_list')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'award_list' ? 'bg-primary text-white' : 'border border-line dark:border-line-dark text-text-muted hover:text-text-primary'}`}>
              <Award className="w-3.5 h-3.5" /> Marks Award List
            </button>
            <button type="button" onClick={() => setActiveTab('gazette')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === 'gazette' ? 'bg-primary text-white' : 'border border-line dark:border-line-dark text-text-muted hover:text-text-primary'}`}>
              <FileSpreadsheet className="w-3.5 h-3.5" /> Result Gazette
            </button>
          </div>

          {activeTab === 'award_list' && papers.length > 0 && (
            <select value={selectedPaperIdx} onChange={(e) => setSelectedPaperIdx(Number(e.target.value))} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-line dark:border-line-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-primary-dark">
              {papers.map((p, idx) => <option key={idx} value={idx}>{p.subject_name} • {p.grade_name || 'Class'} ({p.section || 'A'})</option>)}
            </select>
          )}

          <button type="button" onClick={() => window.print()} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary/90 shadow-2xs">
            <Printer className="w-3.5 h-3.5" /> Print Page (A4)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/10">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-text-muted">Loading printable dataset...</div>
          ) : (
            <div className="max-w-[760px] mx-auto shadow-md rounded-xl overflow-hidden">
              {activeTab === 'datesheet' && <ExamDatesheetPrintView exam={currentExam} signature={data.signature} stamp={data.stamp} />}
              {activeTab === 'award_list' && <ExamAwardListPrintView exam={currentExam} paper={activePaper} marks={data.marks} signature={data.signature} stamp={data.stamp} />}
              {activeTab === 'gazette' && <ExamGazettePrintView exam={currentExam} marks={data.marks} signature={data.signature} stamp={data.stamp} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
