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
    <div className="w-full space-y-4 pb-12">
      <AttendanceTopTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {feedback.error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold">
          {feedback.error}
        </div>
      )}

      {feedback.success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          {feedback.success}
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="pt-1">
          <EmployeeAttendancePage />
        </div>
      )}

      {activeTab === 'leave' && (
        <div className="pt-1">
          <LeaveRequestPage />
        </div>
      )}

      {activeTab === 'report' && (
        <div className="pt-1">
          <AttendanceReportPage />
        </div>
      )}

      {activeTab === 'realtime' && (
        <div className="pt-1">
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
        <div className="space-y-4 pt-1">
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

          <StudentAttendanceContentCard
            loaded={loaded}
            loading={loading}
            records={filteredRecords}
            summary={summary}
            onStatusChange={handleStatusChange}
            onRemarksChange={handleRemarksChange}
          />
        </div>
      )}

      <AttendanceStatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        summary={summary}
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
