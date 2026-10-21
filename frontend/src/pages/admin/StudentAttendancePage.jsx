import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStudentAttendance } from '../../hooks/useStudentAttendance';
import AttendanceTopTabs from '../../components/admin/attendance/AttendanceTopTabs';
import StudentAttendanceFilterBar from '../../components/admin/attendance/StudentAttendanceFilterBar';
import StudentAttendanceContentCard from '../../components/admin/attendance/StudentAttendanceContentCard';
import CardScannerTerminal from '../../components/admin/attendance/CardScannerTerminal';
import AttendanceStatsModal from '../../components/admin/attendance/AttendanceStatsModal';
import AttendanceSettingsModal from '../../components/admin/attendance/AttendanceSettingsModal';
import EmployeeAttendancePage from './EmployeeAttendancePage';
import LeaveRequestPage from './LeaveRequestPage';
import AttendanceReportPage from './AttendanceReportPage';
import StudentAttendancePrintSheet from '../../components/admin/attendance/StudentAttendancePrintSheet';

const StudentAttendancePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'student';

  const {
    date, setDate, grades, selectedGradeId, setSelectedGradeId,
    sections, selectedSection, setSelectedSection, records, filteredRecords, summary, search, setSearch,
    sortBy, setSortBy, loading, loaded, saving, scanning, lastScanned, scanHistory, feedback,
    handleShow, handleStatusChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  } = useStudentAttendance();

  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentGrade = grades.find((g) => g._id === selectedGradeId);
  const classLabel = currentGrade ? currentGrade.name : 'Selected Class';

  const handleTabChange = (tabId) => {
    setSearchParams(tabId === 'student' ? {} : { tab: tabId });
  };

  return (
    <div className="w-full min-h-full flex flex-col gap-3">
      <div className="shrink-0 sticky top-0 z-30 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-xs pb-1 print:hidden">
        <AttendanceTopTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      </div>

      {activeTab === 'student' && feedback.error && (
        <div className="shrink-0 p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold print:hidden">
          {feedback.error}
        </div>
      )}

      {activeTab === 'student' && feedback.success && (
        <div className="shrink-0 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold print:hidden">
          {feedback.success}
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <EmployeeAttendancePage />
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <LeaveRequestPage />
        </div>
      )}

      {activeTab === 'report' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <AttendanceReportPage />
        </div>
      )}

      {activeTab === 'realtime' && (
        <div className="flex-1 min-h-0 flex flex-col">
          <CardScannerTerminal
            onScanCode={handleScanCode}
            scanning={scanning}
            lastScanned={lastScanned}
            scanHistory={scanHistory}
            onOverrideStatus={handleStatusChange}
          />
        </div>
      )}

      {activeTab === 'student' && (
        <>
          <div className="flex-1 min-h-0 flex flex-col gap-3 print:hidden">
            <div className="shrink-0">
              <StudentAttendanceFilterBar
                grades={grades}
                selectedGradeId={selectedGradeId}
                onGradeChange={(id) => {
                  setSelectedGradeId(id);
                  setSelectedSection('');
                }}
                sections={sections}
                selectedSection={selectedSection}
                onSectionChange={setSelectedSection}
                date={date}
                onDateChange={setDate}
                search={search}
                onSearchChange={setSearch}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onShow={handleShow}
                onSave={handleSave}
                onMarkAll={handleMarkAll}
                onOpenStats={() => setStatsOpen(true)}
                onPrint={() => window.print()}
                loading={loading}
                saving={saving}
                loaded={loaded}
                hasRecords={records.length > 0}
              />
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <StudentAttendanceContentCard
                loaded={loaded}
                loading={loading}
                records={filteredRecords}
                summary={summary}
                onStatusChange={handleStatusChange}
                onRemarksChange={handleRemarksChange}
              />
            </div>
          </div>

          <StudentAttendancePrintSheet
            records={records}
            summary={summary}
            classLabel={classLabel}
            section={selectedSection}
            date={date}
          />
        </>
      )}

      <AttendanceStatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        summary={summary}
        records={records}
        classLabel={classLabel}
        date={date}
      />

      <AttendanceSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default StudentAttendancePage;
