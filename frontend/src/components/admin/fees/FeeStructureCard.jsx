import { Landmark } from 'lucide-react';

const FeeStructureCard = ({ students }) => {
  const gradeMap = new Map();

  (students || []).forEach((s) => {
    const gradeName = s.current_grade?.name || 'Unassigned';
    if (!gradeMap.has(gradeName)) {
      gradeMap.set(gradeName, { name: gradeName, count: 0, totalFee: 0, totalDiscount: 0 });
    }
    const g = gradeMap.get(gradeName);
    g.count += 1;
    g.totalFee += Number(s.monthly_fee || 0);
    g.totalDiscount += Number(s.discount || 0);
  });

  const gradeList = Array.from(gradeMap.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-3xl border border-line dark:border-line-dark shadow-sm overflow-hidden">
      <div className="p-4 border-b border-line dark:border-line-dark flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-ink dark:text-ink-dark">Institutional Fee Structure by Grade</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
          {gradeList.length} Classes Defined
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-secondary/60 dark:bg-surface-secondary-dark/60 text-ink-muted text-[10px] font-bold uppercase tracking-wider border-b border-line dark:border-line-dark">
            <tr>
              <th className="py-3 px-4">Class / Grade</th>
              <th className="py-3 px-4">Enrolled Students</th>
              <th className="py-3 px-4">Avg Fee / Student</th>
              <th className="py-3 px-4">Total Concessions</th>
              <th className="py-3 px-4 text-right">Net Monthly Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line dark:divide-line-dark text-ink dark:text-ink-dark">
            {gradeList.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-xs text-ink-muted">
                  No grade structures populated yet.
                </td>
              </tr>
            ) : (
              gradeList.map((g) => {
                const avg = g.count > 0 ? Math.round(g.totalFee / g.count) : 0;
                const net = Math.max(0, g.totalFee - g.totalDiscount);
                return (
                  <tr key={g.name} className="hover:bg-surface-secondary/30 dark:hover:bg-surface-secondary-dark/20 transition-colors">
                    <td className="py-3 px-4 font-bold text-ink dark:text-ink-dark">{g.name}</td>
                    <td className="py-3 px-4 font-medium">{g.count} Students</td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">Rs. {avg.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-good">- Rs. {g.totalDiscount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-ink dark:text-ink-dark">Rs. {net.toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStructureCard;
