import React, { useState } from 'react';
import { useStaffAttendance } from '../../hooks/useStaffAttendance';
import { useComingSoon } from '../../context/ComingSoonContext';
import StaffAttendanceKpiRow from '../../components/admin/attendance/staff/StaffAttendanceKpiRow';
import StaffAttendanceFilterBar from '../../components/admin/attendance/staff/StaffAttendanceFilterBar';
import StaffAttendanceTableCard from '../../components/admin/attendance/staff/StaffAttendanceTableCard';
import StaffAttendanceResetModal from '../../components/admin/attendance/staff/StaffAttendanceResetModal';
import StaffDailyReportModal from '../../components/admin/attendance/staff/StaffDailyReportModal';

const EmployeeAttendancePage = () => {
  const {
    date,
    setDate,
    department,
    setDepartment,
    filteredRecords,
    records,
    summary,
    search,
    setSearch,
    handleToggleSort,
    loading,
    saving,
    resetting,
    feedback,
    fetchSheet,
    handleStatusChange,
    handleTimeChange,
    handleMarkAll,
    handleSave,
    handleReset
  } = useStaffAttendance();

  const { openComingSoon } = useComingSoon();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const onConfirmReset = async () => {
    const success = await handleReset();
    if (success) {
      setResetModalOpen(false);
    }
  };

  const onTransferAttendance = () => {
    openComingSoon(
      'Transfer Attendance',
      'Automated biometric device sync and cloud machine integration will be available in the upcoming release.'
    );
  };

  const onMarkSunday = () => {
    openComingSoon(
      'Mark Sunday Attendance',
      'Automated weekend off and Sunday holiday marking scheduler is in active development.'
    );
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0 gap-3">
      <div className="shrink-0 space-y-3">
        <StaffAttendanceKpiRow summary={summary} />

        {feedback.error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold animate-in fade-in duration-200">
            {feedback.error}
          </div>
        )}

        {feedback.success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold animate-in fade-in duration-200">
            {feedback.success}
          </div>
        )}

        <StaffAttendanceFilterBar
          department={department}
          onDepartmentChange={setDepartment}
          date={date}
          onDateChange={setDate}
          search={search}
          onSearchChange={setSearch}
          onToggleSort={handleToggleSort}
          onShow={fetchSheet}
          onSave={handleSave}
          onTransferAttendance={onTransferAttendance}
          onMarkHoliday={() => handleMarkAll('Hol')}
          onReport={() => setReportModalOpen(true)}
          onMarkSunday={onMarkSunday}
          onReset={() => setResetModalOpen(true)}
          loading={loading}
          saving={saving}
          loaded={records.length > 0}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <StaffAttendanceTableCard
          records={filteredRecords}
          loading={loading}
          onStatusChange={handleStatusChange}
          onTimeChange={handleTimeChange}
        />
      </div>

      <StaffAttendanceResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={onConfirmReset}
        date={date}
        loading={resetting}
      />

      <StaffDailyReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        date={date}
        records={filteredRecords}
        summary={summary}
      />
    </div>
  );
};

export default EmployeeAttendancePage;
