const ReportCardMarksTable = ({ examResults = [], testResults = [] }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-ink">
          Examinations & Term Assessments
        </h3>
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/70 border-b border-line text-ink-muted uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">Subject</th>
                <th className="px-3 py-2.5 text-center">Max Marks</th>
                <th className="px-3 py-2.5 text-center">Obtained</th>
                <th className="px-3 py-2.5 text-center">%</th>
                <th className="px-3 py-2.5 text-center">Grade</th>
                <th className="px-3 py-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {examResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-ink-muted">
                    No term examination marks published yet for this student.
                  </td>
                </tr>
              ) : (
                examResults.map((r, i) => (
                  <tr key={r.id || i} className="hover:bg-surface-secondary/30">
                    <td className="px-3 py-2 text-ink-muted">{i + 1}</td>
                    <td className="px-3 py-2 font-bold text-ink">
                      {r.subject_name} {r.subject_code ? `(${r.subject_code})` : ''}
                    </td>
                    <td className="px-3 py-2 text-center text-ink">{r.max_marks}</td>
                    <td className="px-3 py-2 text-center font-bold text-ink">
                      {r.is_absent ? <span className="text-bad">ABS</span> : r.obtained_marks}
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-ink">
                      {r.is_absent ? '—' : `${r.percentage}%`}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-black text-white" style={{ backgroundColor: r.status_color || '#0d9488' }}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.is_absent ? 'bg-bad/10 text-bad' : r.percentage >= 33 ? 'bg-good/10 text-good' : 'bg-bad/10 text-bad'
                      }`}>
                        {r.is_absent ? 'Absent' : r.percentage >= 33 ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-ink">
            Periodic Class Tests & Quizzes
          </h3>
          <div className="overflow-x-auto rounded-xl border border-line bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 border-b border-line text-ink-muted uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-3 py-2">Test Title</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2 text-center">Total</th>
                  <th className="px-3 py-2 text-center">Obtained</th>
                  <th className="px-3 py-2 text-center">%</th>
                  <th className="px-3 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {testResults.map((t, idx) => (
                  <tr key={t.id || idx} className="hover:bg-surface-secondary/30">
                    <td className="px-3 py-1.5 font-medium text-ink">{t.title}</td>
                    <td className="px-3 py-1.5 text-ink">{t.subject_name}</td>
                    <td className="px-3 py-1.5 text-center text-ink">{t.total_marks}</td>
                    <td className="px-3 py-1.5 text-center font-bold text-ink">{t.obtained_marks}</td>
                    <td className="px-3 py-1.5 text-center text-ink">{t.percentage}%</td>
                    <td className="px-3 py-1.5 text-center font-bold text-primary">{t.grade_letter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCardMarksTable;
