import React, { useState, useEffect } from 'react';
import { Table, Award, Loader2 } from 'lucide-react';
import api from '../../services/api';
import StudentExamTablesView from './StudentExamTablesView';
import ReportCardTemplateToolbar from '../admin/reports/reportcards/ReportCardTemplateToolbar';
import ReportCardRenderer from '../admin/reports/reportcards/ReportCardRenderer';

const StudentExamResultsTab = ({ studentId, markSheets = [], classTests = [], attendance = {} }) => {
  const [viewMode, setViewMode] = useState('card');
  const [template, setTemplate] = useState(() => {
    try { return localStorage.getItem('eliteedu_reportcard_style') || 'yellow_permanent'; } catch { return 'yellow_permanent'; }
  });
  const [orientation, setOrientation] = useState(() => {
    try { return localStorage.getItem('eliteedu_reportcard_orientation') || 'portrait'; } catch { return 'portrait'; }
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId && viewMode === 'card' && !reportData) {
      setLoading(true);
      api.get(`/reports/student-report-card/${studentId}`)
        .then((res) => { if (res.data?.success) setReportData(res.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [studentId, viewMode, reportData]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface border border-line p-2.5 rounded-2xl print:hidden">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span className="text-xs font-bold text-ink">Academic Performance & Progress</span>
        </div>
        <div className="flex rounded-xl border border-line p-0.5 bg-surface-secondary/40 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode('card')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'card' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Award size={13} />
            <span>Official Report Card</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'table' ? 'bg-primary text-white shadow-2xs' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Table size={13} />
            <span>Detailed Tables</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <StudentExamTablesView studentId={studentId} markSheets={markSheets} classTests={classTests} attendance={attendance} />
      ) : (
        <div className="space-y-4">
          <ReportCardTemplateToolbar
            selectedTemplate={template}
            onSelectTemplate={setTemplate}
            orientation={orientation}
            onToggleOrientation={setOrientation}
            onPrint={() => window.print()}
          />
          {loading ? (
            <div className="flex items-center justify-center py-20 text-ink-muted text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Generating official report card...</span>
            </div>
          ) : reportData ? (
            <div className="flex justify-center w-full">
              <ReportCardRenderer
                template={template}
                orientation={orientation}
                student={reportData.student}
                header={reportData.header}
                examResults={reportData.examResults}
                testResults={reportData.testResults}
                academicSummary={reportData.academicSummary}
                remarks={reportData.remarks}
                attendance={reportData.attendance}
                behaviorRecord={reportData.behaviorRecord}
              />
            </div>
          ) : (
            <StudentExamTablesView studentId={studentId} markSheets={markSheets} classTests={classTests} attendance={attendance} />
          )}
        </div>
      )}
    </div>
  );
};

export default StudentExamResultsTab;
