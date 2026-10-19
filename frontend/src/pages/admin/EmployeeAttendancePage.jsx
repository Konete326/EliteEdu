import { useStaffAttendance } from '../../hooks/useStaffAttendance';
import StaffAttendanceHeader from '../../components/admin/attendance/staff/StaffAttendanceHeader';
import StaffAttendanceKpiStrip from '../../components/admin/attendance/staff/StaffAttendanceKpiStrip';
import StaffAttendanceControlDock from '../../components/admin/attendance/staff/StaffAttendanceControlDock';
import StaffManualAttendanceSheet from '../../components/admin/attendance/staff/StaffManualAttendanceSheet';
import StaffCardScannerTerminal from '../../components/admin/attendance/staff/StaffCardScannerTerminal';

const EmployeeAttendancePage = () => {
  const {
    mode, setMode, date, setDate, campuses, campusId, setCampusId,
    designation, setDesignation, filteredRecords, summary, search, setSearch,
    loading, saving, scanning, lastScanned, scanHistory, feedback,
    handleStatusChange, handleTimeChange, handleRemarksChange, handleMarkAll, handleSave, handleScanCode
  } = useStaffAttendance();

  return (
    <div className="w-full space-y-6 pb-12">
      <StaffAttendanceHeader
        mode={mode}
        onModeChange={setMode}
        summary={summary}
        saving={saving}
        onSave={handleSave}
      />

      <StaffAttendanceKpiStrip summary={summary} />

      {feedback.error && (
        <div className="p-3.5 rounded-xl bg-bad/10 text-bad border border-bad/20 text-xs font-semibold">
          {feedback.error}
        </div>
      )}

      {feedback.success && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
          {feedback.success}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-4">
          <StaffAttendanceControlDock
            date={date}
            setDate={setDate}
            campuses={campuses}
            campusId={campusId}
            setCampusId={setCampusId}
            designation={designation}
            setDesignation={setDesignation}
            summary={summary}
            totalStaff={summary.total || filteredRecords.length}
          />
        </div>

        <div className="xl:col-span-8">
          {mode === 'manual' ? (
            <StaffManualAttendanceSheet
              search={search}
              setSearch={setSearch}
              filteredRecords={filteredRecords}
              onStatusChange={handleStatusChange}
              onTimeChange={handleTimeChange}
              onRemarksChange={handleRemarksChange}
              onMarkAll={handleMarkAll}
              onSave={handleSave}
              saving={saving}
              loading={loading}
            />
          ) : (
            <StaffCardScannerTerminal
              onScanCode={handleScanCode}
              scanning={scanning}
              lastScanned={lastScanned}
              scanHistory={scanHistory}
              onOverrideStatus={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
