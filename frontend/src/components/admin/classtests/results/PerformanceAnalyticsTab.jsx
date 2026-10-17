import React from 'react';
import { Award, AlertTriangle, TrendingUp, BarChart2 } from 'lucide-react';

export default function PerformanceAnalyticsTab({ data, isLoading }) {
  const topPerformers = data?.topPerformers || [];
  const interventionList = data?.interventionList || [];
  const subjectAverages = data?.subjectAverages || [];

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-text-muted">Calculating school-wide performance metrics...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
          <BarChart2 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Subject-wise Average Score (%)</h3>
        </div>

        {subjectAverages.length === 0 ? (
          <p className="text-xs text-text-muted">No subject scores recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {subjectAverages.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-text-primary dark:text-text-primary-dark">
                  <span>{s.subject}</span>
                  <span className="text-primary">{s.average_percentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted/40 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${s.average_percentage >= 70 ? 'bg-emerald-500' : s.average_percentage >= 40 ? 'bg-primary' : 'bg-red-500'}`} style={{ width: `${Math.min(100, s.average_percentage)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">Top 10 Performers Leaderboard</h3>
          </div>

          {topPerformers.length === 0 ? (
            <p className="text-xs text-text-muted">No performers recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {topPerformers.map((p, idx) => (
                <div key={p.student_id} className="flex items-center justify-between p-2 rounded-xl bg-muted/20 border border-line/40 dark:border-line-dark/40 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-gray-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-muted text-text-muted'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-text-primary dark:text-text-primary-dark block">{p.name}</span>
                      <span className="text-[10px] text-text-muted">GR: {p.gr_number || '-'} • Roll: {p.roll_number || '-'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-primary">{p.percentage}%</span>
                    <span className="text-[10px] font-bold text-emerald-600 block">{p.grade_letter}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-line dark:border-line-dark">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark">At-Risk Intervention List (&lt; 33%)</h3>
          </div>

          {interventionList.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 font-semibold">
              Excellent! No students currently falling below the 33% passing threshold.
            </div>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {interventionList.map((st) => (
                <div key={st.student_id} className="flex items-center justify-between p-2 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 text-xs">
                  <div>
                    <span className="font-bold text-text-primary dark:text-text-primary-dark block">{st.name}</span>
                    <span className="text-[10px] text-text-muted">GR: {st.gr_number || '-'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-600">{st.percentage}%</span>
                    <span className="text-[10px] font-bold text-red-500 block">Needs Support</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
