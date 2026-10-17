import React from 'react';
import { Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function ExamsKpiStrip({ exams = [], total = 0 }) {
  const totalPapers = exams.reduce((acc, e) => acc + (e.papers?.length || 0), 0);
  const publishedExams = exams.filter((e) => e.status === 'Published').length;
  const submittedPapers = exams.reduce((acc, e) => acc + (e.papers?.filter((p) => p.marks_submitted)?.length || 0), 0);
  const marksCompletionRate = totalPapers > 0 ? Math.round((submittedPapers / totalPapers) * 100) : 0;

  const kpis = [
    { label: 'Total Exams', val: total, sub: `${publishedExams} Published`, icon: Calendar, color: 'text-primary' },
    { label: 'Scheduled Papers', val: totalPapers, sub: `${exams.length} active terms`, icon: FileText, color: 'text-blue-500' },
    { label: 'Marks Submitted', val: `${submittedPapers}/${totalPapers}`, sub: `${marksCompletionRate}% complete`, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Pending Evaluation', val: totalPapers - submittedPapers, sub: 'Needs marking', icon: Clock, color: 'text-amber-500' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {kpis.map((k, idx) => {
        const Icon = k.icon;
        return (
          <div key={idx} className="p-3.5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-text-muted dark:text-text-muted-dark block">{k.label}</span>
              <span className="text-lg font-black text-text-primary dark:text-text-primary-dark tracking-tight mt-0.5 block">{k.val}</span>
              <span className="text-[10px] font-semibold text-text-muted dark:text-text-muted-dark block mt-0.5">{k.sub}</span>
            </div>
            <div className={`p-2 rounded-xl bg-muted/30 ${k.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
