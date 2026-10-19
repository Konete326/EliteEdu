import OfficialSignatureStampBlock from '../../common/OfficialSignatureStampBlock';
import ReportCardBehaviorBlock from './ReportCardBehaviorBlock';

const ReportCardSummaryStrip = ({
  academicSummary = {},
  attendance = {},
  remarks = {},
  behaviorRecord = null
}) => {
  return (
    <div className="space-y-4 pt-3 border-t border-line">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-surface-secondary/70 border border-line text-xs">
        <div>
          <span className="text-[10px] text-ink-muted uppercase font-bold block">Total Marks</span>
          <span className="font-bold text-ink">{academicSummary.totalObtained ?? 0} / {academicSummary.totalMax ?? 0}</span>
        </div>
        <div>
          <span className="text-[10px] text-ink-muted uppercase font-bold block">Overall Percentage</span>
          <span className="text-base font-black text-primary">{academicSummary.overallPercentage ?? 0}%</span>
        </div>
        <div>
          <span className="text-[10px] text-ink-muted uppercase font-bold block">Final Grade</span>
          <span className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-black text-white" style={{ backgroundColor: academicSummary.statusColor || '#16A34A' }}>
            Grade {academicSummary.overallGrade || 'F'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-ink-muted uppercase font-bold block">Academic Standing</span>
          <span className="font-bold text-good">{academicSummary.resultStatus || 'Passed'}</span>
        </div>
      </div>

      <div className="p-3 rounded-2xl border border-line bg-surface space-y-1.5 text-xs">
        <h4 className="text-[11px] font-black uppercase text-ink-muted tracking-wider">Attendance Summary</h4>
        <div className="flex flex-wrap items-center justify-between gap-2 text-ink">
          <span>Working Days: <strong className="font-bold">{attendance.totalDays ?? 0}</strong></span>
          <span>Present: <strong className="text-good font-bold">{attendance.presentDays ?? 0}</strong></span>
          <span>Absent: <strong className="text-bad font-bold">{attendance.absentDays ?? 0}</strong></span>
          <span>Leaves: <strong className="text-amber-600 font-bold">{attendance.leaveDays ?? 0}</strong></span>
          <span>Attendance Ratio: <strong className="text-primary font-bold">{attendance.attendancePercentage ?? 100}%</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl border border-line bg-surface">
          <span className="text-[10px] text-ink-muted uppercase font-bold block mb-1">Class Teacher Remarks</span>
          <p className="font-medium text-ink italic">&quot;{remarks.teacher || 'Satisfactory academic progress.'}&quot;</p>
        </div>
        <div className="p-3 rounded-2xl border border-line bg-surface">
          <span className="text-[10px] text-ink-muted uppercase font-bold block mb-1">Principal / Incharge Remarks</span>
          <p className="font-medium text-ink italic">&quot;{remarks.principal || 'Promoted to the next academic grade.'}&quot;</p>
        </div>
      </div>

      <ReportCardBehaviorBlock behaviorRecord={behaviorRecord} />

      <div className="pt-2">
        <OfficialSignatureStampBlock
          showStamp={true}
          showSignature={true}
          signatureTitle="Principal / Head of Institution"
          stampTitle="Institution Stamp"
        />
      </div>
    </div>
  );
};

export default ReportCardSummaryStrip;
