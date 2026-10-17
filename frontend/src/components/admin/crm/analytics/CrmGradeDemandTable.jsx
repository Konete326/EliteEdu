import React from 'react';
import { BookOpen } from 'lucide-react';

export default function CrmGradeDemandTable({ gradeDemand = [] }) {
  return (
    <div className="p-5 rounded-2xl border border-line dark:border-line-dark bg-surface dark:bg-surface-dark shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-line dark:border-line-dark pb-2">
        <h3 className="text-sm font-bold text-text-primary dark:text-text-primary-dark flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" /> Class-wise Admission Demand
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/50 text-text-muted font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="px-4 py-2.5">Class / Grade</th>
              <th className="px-4 py-2.5 text-center">Inquiries</th>
              <th className="px-4 py-2.5 text-center">Enrolled</th>
              <th className="px-4 py-2.5 text-right">Yield %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark">
            {gradeDemand.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-text-muted">No class-wise data recorded.</td>
              </tr>
            ) : (
              gradeDemand.map((g) => {
                const yieldRate = g.inquiries > 0 ? ((g.enrolled / g.inquiries) * 100).toFixed(1) : 0;
                return (
                  <tr key={g.className} className="hover:bg-hover">
                    <td className="px-4 py-2.5 font-bold text-text-primary dark:text-text-primary-dark">{g.className}</td>
                    <td className="px-4 py-2.5 text-center font-medium">{g.inquiries}</td>
                    <td className="px-4 py-2.5 text-center text-emerald-600 font-bold">{g.enrolled}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-primary">{yieldRate}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
