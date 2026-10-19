import React from 'react';
import ReportCardHeaderStrip from '../ReportCardHeaderStrip';
import ReportCardMarksTable from '../ReportCardMarksTable';
import ReportCardSummaryStrip from '../ReportCardSummaryStrip';

const ReportCardClassicInstitutional = ({
  student = {}, header = {}, examResults = [], testResults = [],
  academicSummary = {}, remarks = {}, attendance = {}, behaviorRecord = null, orientation = 'portrait'
}) => {
  return (
    <div className={`w-full bg-surface text-ink space-y-4 select-none ${orientation === 'landscape' ? 'p-2' : 'p-4'}`}>
      <ReportCardHeaderStrip student={student} header={header} />
      <ReportCardMarksTable examResults={examResults} testResults={testResults} />
      <ReportCardSummaryStrip
        academicSummary={academicSummary}
        attendance={attendance}
        remarks={remarks}
        behaviorRecord={behaviorRecord}
      />
    </div>
  );
};

export default ReportCardClassicInstitutional;
